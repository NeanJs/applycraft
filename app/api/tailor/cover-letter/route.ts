import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { runTailorEngine } from "@/app/lib/ai/tailor-engine";
import { removeNullChars } from "@/app/helpers/removeNullChars";
import { TAILOR_MODES } from "@/app/lib/ai/prompts/modes/modes";
import { syncUser } from "@/app/lib/sync-user";
import {
  getCachedTailorResult,
  setCachedTailorResult,
} from "@/app/lib/ai/cache";
import { buildRequestHash } from "@/app/lib/ai/request-hash";
import { withInFlight } from "@/app/lib/ai/inflight";
import { logAIRequestMetric } from "@/app/lib/analytics/server-track";
import {
  MAX_JOB_DESCRIPTION_CHARS,
  MAX_RESUME_CHARS,
  AIOutputValidationError,
} from "@/app/lib/ai/quality";
import { ParseClaudeResponseError } from "@/app/lib/ai/parser";

const PROMPT_VERSION = "v5-resume-metadata";

type CoverLetterResultData = {
  coverLetter?: string;
  job?: unknown;
} & Record<string, unknown>;

export async function POST(req: Request) {
  const startedAt = performance.now();
  let llmMs = 0;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "invalid_request_json", message: "Request body must be valid JSON." },
      { status: 400 },
    );
  }
  if (!body || typeof body !== "object") {
    return Response.json(
      { error: "invalid_request_body", message: "Request body must be a JSON object." },
      { status: 400 },
    );
  }
  const payload = body as Record<string, unknown>;
  const rawResume = typeof payload.resume === "string" ? payload.resume : "";
  const rawJobDescription =
    typeof payload.jobDescription === "string" ? payload.jobDescription : "";
  const resumeId =
    typeof payload.resumeId === "string" ? payload.resumeId : null;

  const cleanedResume = (removeNullChars(rawResume) as string).trim();
  const cleanedJobDescription = (removeNullChars(rawJobDescription) as string).trim();

  if (!cleanedResume || !cleanedJobDescription) {
    return Response.json(
      { error: "Resume and job description are required." },
      { status: 400 },
    );
  }

  if (
    cleanedResume.length > MAX_RESUME_CHARS ||
    cleanedJobDescription.length > MAX_JOB_DESCRIPTION_CHARS
  ) {
    return Response.json(
      {
        error: "input_too_long",
        message: `Resume must be at most ${MAX_RESUME_CHARS.toLocaleString()} characters and job description at most ${MAX_JOB_DESCRIPTION_CHARS.toLocaleString()} characters.`,
      },
      { status: 413 },
    );
  }

  const requestHash = buildRequestHash({
    mode: TAILOR_MODES.COVER_LETTER_ONLY,
    resume: cleanedResume,
    jobDescription: cleanedJobDescription,
    includeCoverLetter: true,
    promptVersion: PROMPT_VERSION,
  });

  const cached = await getCachedTailorResult({
    mode: TAILOR_MODES.COVER_LETTER_ONLY,
    includeCoverLetter: true,
    hash: requestHash,
  });

  let result: {
    mode: typeof TAILOR_MODES.COVER_LETTER_ONLY;
    data: CoverLetterResultData;
    usage: {
      inputTokens: number;
      outputTokens: number;
      cacheReadTokens: number;
      cacheCreationTokens: number;
    } | null;
  };
  try {
    result = cached
      ? {
          mode: TAILOR_MODES.COVER_LETTER_ONLY,
          data: cached as CoverLetterResultData,
          usage: null,
        }
      : await withInFlight(`cover-letter:${requestHash}`, async () => {
          const maybeCached = await getCachedTailorResult({
            mode: TAILOR_MODES.COVER_LETTER_ONLY,
            includeCoverLetter: true,
            hash: requestHash,
          });

          if (maybeCached) {
            return {
              mode: TAILOR_MODES.COVER_LETTER_ONLY,
              data: maybeCached as CoverLetterResultData,
              usage: null,
            };
          }

          const llmStart = performance.now();
          const generated = await runTailorEngine({
            resume: cleanedResume,
            jobDescription: cleanedJobDescription,
            mode: TAILOR_MODES.COVER_LETTER_ONLY,
            includeCoverLetter: true,
          });
          llmMs = performance.now() - llmStart;

          await setCachedTailorResult({
            mode: TAILOR_MODES.COVER_LETTER_ONLY,
            includeCoverLetter: true,
            hash: requestHash,
            result: removeNullChars(generated.data) as Record<string, unknown>,
            promptVersion: PROMPT_VERSION,
          });

          return {
            mode: TAILOR_MODES.COVER_LETTER_ONLY,
            data: generated.data as CoverLetterResultData,
            usage: generated.usage,
          };
        });
  } catch (error) {
    if (
      error instanceof AIOutputValidationError ||
      error instanceof ParseClaudeResponseError
    ) {
      console.error("Cover letter output rejected:", error);
      return Response.json(
        {
          error: "invalid_model_response",
          message: "Generated content did not pass validation. Please retry.",
        },
        { status: 502 },
      );
    }
    throw error;
  }

  const coverLetter = typeof result.data?.coverLetter === "string"
    ? result.data.coverLetter
    : "";

  const totalMs = performance.now() - startedAt;

  const { userId } = await auth();
  if (userId && resumeId) {
    const dbUser = await syncUser();
    if (dbUser) {
      await prisma.resume.updateMany({
        where: {
          id: resumeId,
          userId: dbUser.id,
        },
        data: {
          coverLetter,
        },
      });
    }
  }

  logAIRequestMetric({
    sessionKey: requestHash,
    route: "cover-letter",
    mode: TAILOR_MODES.COVER_LETTER_ONLY,
    cacheHit: !!cached,
    totalMs,
    llmMs,
    promptVersion: PROMPT_VERSION,
    userId: undefined,
    inputTokens: result.usage?.inputTokens,
    outputTokens: result.usage?.outputTokens,
    cacheReadTokens: result.usage?.cacheReadTokens,
    cacheCreationTokens: result.usage?.cacheCreationTokens,
  });

  return Response.json({
    coverLetter,
    cacheHit: !!cached,
    job: result.data?.job ?? null,
    perf: {
      totalMs,
      llmMs,
    },
  });
}
