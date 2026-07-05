import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { runTailorEngine } from "@/app/lib/ai/tailor-engine";
import {
  getClientIP,
  checkAnonRateLimit,
} from "@/app/helpers/checkAnonRateLimit";
import { saveGeneration } from "@/app/lib/saveGeneration";
import { prisma } from "@/app/lib/prisma";
import { syncUser } from "@/app/lib/sync-user";

import { getGenerationMeta } from "@/app/helpers/getGenerationMeta";
import { removeNullChars } from "@/app/helpers/removeNullChars";
import { TAILOR_MODES, type TailorMode } from "@/app/lib/ai/prompts/modes/modes";
import {
  getCachedTailorResult,
  setCachedTailorResult,
} from "@/app/lib/ai/cache";
import { buildRequestHash } from "@/app/lib/ai/request-hash";
import { withInFlight } from "@/app/lib/ai/inflight";
import { logAIRequestMetric } from "@/app/lib/analytics/server-track";
import { handleError } from "@/app/lib/errorHandler";
import type { JobMetadata } from "@/app/types/tailor";

const PROMPT_VERSION = "v2-week1";

type TailorResultData = {
  job?: unknown;
  atsBefore?: number | null;
  atsAfter?: number | null;
  atsBreakdown?: unknown;
  optimizedResume?: string;
  coverLetter?: string;
  missingKeywords?: string[];
  changesMade?: string[];
  confidenceScore?: number | null;
  jobType?: string | null;
} & Record<string, unknown>;

function isTailorMode(value: unknown): value is TailorMode {
  return (
    typeof value === "string" &&
    (Object.values(TAILOR_MODES) as string[]).includes(value)
  );
}

function isJobMetadata(value: unknown): value is JobMetadata {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.jobTitle === "string" &&
    typeof candidate.companyName === "string"
  );
}

function responseWithTiming(payload: unknown, timing: {
  totalMs: number;
  llmMs: number;
  dbMs: number;
  cacheHit: boolean;
}) {
  const serverTiming = [
    `total;dur=${timing.totalMs.toFixed(1)}`,
    `llm;dur=${timing.llmMs.toFixed(1)}`,
    `db;dur=${timing.dbMs.toFixed(1)}`,
    `cache;desc=${timing.cacheHit ? "hit" : "miss"}`,
  ].join(", ");

  return Response.json(payload, {
    headers: {
      "Server-Timing": serverTiming,
    },
  });
}

export async function POST(req: Request) {
  const startedAt = performance.now();
  let llmMs = 0;
  let dbMs = 0;
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return Response.json(
        {
          error: "invalid_request_json",
          message: "Request body must be valid JSON.",
        },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object") {
      return Response.json(
        {
          error: "invalid_request_body",
          message: "Request body must be a JSON object.",
        },
        { status: 400 },
      );
    }

    const payload = body as Record<string, unknown>;
    const rawResume = typeof payload.resume === "string" ? payload.resume : "";
    const rawJobDescription =
      typeof payload.jobDescription === "string" ? payload.jobDescription : "";

    const modeCandidate = payload.mode;
    if (typeof modeCandidate === "string" && !isTailorMode(modeCandidate)) {
      return Response.json(
        {
          error: "invalid_mode",
          message: "Unsupported tailor mode.",
        },
        { status: 400 },
      );
    }

    const mode: TailorMode = isTailorMode(modeCandidate)
      ? modeCandidate
      : TAILOR_MODES.FULL_OPTIMIZER;

    const resume = removeNullChars(rawResume) as string;
    const jobDescription = removeNullChars(rawJobDescription) as string;

    const requiresJobDescription =
      mode !== TAILOR_MODES.SUMMARY_ONLY &&
      mode !== TAILOR_MODES.BULLET_IMPROVER;
    const cleanedResume = resume.trim();
    const cleanedJobDescription = jobDescription.trim();

    if (!cleanedResume) {
      return Response.json({ error: "Resume is required." }, { status: 400 });
    }

    if (requiresJobDescription && !cleanedJobDescription) {
      return Response.json(
        { error: "Resume and job description are required." },
        { status: 400 },
      );
    }

    const { userId } = await auth();
    const dbUser = userId ? await syncUser() : null;
    const isAuthed = !!userId;

    if (!isAuthed) {
      const ip = await getClientIP(req);
      const allowed = await checkAnonRateLimit(ip);

      if (!allowed) {
        return Response.json(
          {
            error: "free_limit_reached",
            message: "Sign up to continue.",
          },
          { status: 429 },
        );
      }
    }

    const includeCoverLetter =
      mode === TAILOR_MODES.FULL_OPTIMIZER ? false : true;

    const requestHash = buildRequestHash({
      mode,
      resume: cleanedResume,
      jobDescription: cleanedJobDescription,
      includeCoverLetter,
      promptVersion: PROMPT_VERSION,
    });

    const cached = await getCachedTailorResult({
      mode,
      includeCoverLetter,
      hash: requestHash,
    });

    let result: { mode: TailorMode; data: TailorResultData };
    const cacheHit = !!cached;

    if (cached) {
      result = {
        mode,
        data: cached as TailorResultData,
      };
    } else {
      const llmStart = performance.now();
      result = await withInFlight(`tailor:${requestHash}`, async () => {
        const maybeCached = await getCachedTailorResult({
          mode,
          includeCoverLetter,
          hash: requestHash,
        });

        if (maybeCached) {
          return {
            mode,
            data: maybeCached as TailorResultData,
          };
        }

        const generated = await runTailorEngine({
          resume: cleanedResume,
          jobDescription: cleanedJobDescription,
          mode,
          includeCoverLetter,
        });

        await setCachedTailorResult({
          mode,
          includeCoverLetter,
          hash: requestHash,
          result: removeNullChars(generated.data) as Record<string, unknown>,
          promptVersion: PROMPT_VERSION,
        });

        return {
          mode,
          data: generated.data as TailorResultData,
        };
      });
      llmMs = performance.now() - llmStart;
    }

    const jobMeta = isJobMetadata(result.data.job) ? result.data.job : undefined;
    const generationMeta = getGenerationMeta(result.mode, jobMeta);

    let saved = false;
    let resumeData = null;
    let generationData = null;

    if (dbUser && result.mode === TAILOR_MODES.FULL_OPTIMIZER) {
      const dbStart = performance.now();
      const safeResultData = removeNullChars(result.data) as TailorResultData;

      resumeData = await prisma.resume.create({
        data: {
          user: {
            connect: {
              id: dbUser.id,
            },
          },
          originalResume: cleanedResume,
          jobDescription: cleanedJobDescription,
          title: generationMeta.title,
          atsBefore: safeResultData.atsBefore ?? 0,
          atsAfter: safeResultData.atsAfter ?? 0,
          atsBreakdown:
            (safeResultData.atsBreakdown as Prisma.InputJsonValue | undefined) ??
            undefined,
          optimizedResume:
            (safeResultData.optimizedResume as Prisma.InputJsonValue | undefined) ??
            {},
          coverLetter: safeResultData.coverLetter ?? "",
          missingKeywords: safeResultData.missingKeywords ?? [],
          changesMade: safeResultData.changesMade ?? [],
          confidenceScore: safeResultData.confidenceScore ?? null,
          jobType: safeResultData.jobType ?? null,
        },
      });

      generationData = await saveGeneration({
        userId: dbUser.id,
        resumeId: resumeData.id,
        type: generationMeta.type,
        title: generationMeta.title,
        result: safeResultData as unknown as Prisma.InputJsonValue,
        input: {
          resume: cleanedResume,
          jobDescription: cleanedJobDescription,
        },
      });

      saved = true;
      dbMs = performance.now() - dbStart;
    }

    const coverLetterPending =
      mode === TAILOR_MODES.FULL_OPTIMIZER &&
      (!(result.data.coverLetter as string | undefined) ||
        !(result.data.coverLetter as string | undefined)?.trim());

    const responsePayload = {
      ...result.data,
      coverLetter: result.data.coverLetter ?? "",
      coverLetterPending,
      mode: result.mode,
      cacheHit,
      saved,
      promptSignup: !dbUser,
      resumeId: resumeData?.id ?? null,
      generationId: generationData?.id ?? null,
    };

    const totalMs = performance.now() - startedAt;

    logAIRequestMetric({
      sessionKey: requestHash,
      route: "tailor",
      mode: result.mode,
      cacheHit,
      totalMs,
      llmMs,
      dbMs,
      promptVersion: PROMPT_VERSION,
      userId: dbUser?.id,
    });

    return responseWithTiming(responsePayload, {
      totalMs,
      llmMs,
      dbMs,
      cacheHit,
    });
  } catch (error) {
    handleError(error, "Tailor API failed.");

    const totalMs = performance.now() - startedAt;
    const message = error instanceof Error ? error.message : "Unknown error";
    const parsingIssue = /parse Claude JSON response|Unexpected end of JSON input|Unexpected token|Unterminated string|empty text response/i.test(
      message,
    );

    return Response.json(
      {
        error: parsingIssue ? "invalid_model_response" : "tailor_failed",
        message: parsingIssue
          ? "Could not parse model output. Please retry."
          : "Something went wrong while tailoring your resume. Please try again.",
      },
      {
        status: parsingIssue ? 502 : 500,
        headers: {
          "Server-Timing": `total;dur=${totalMs.toFixed(1)}`,
        },
      },
    );
  }
}
