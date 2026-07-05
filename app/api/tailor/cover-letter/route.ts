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

const PROMPT_VERSION = "v2-week1";

type CoverLetterResultData = {
  coverLetter?: string;
  job?: unknown;
} & Record<string, unknown>;

export async function POST(req: Request) {
  const startedAt = performance.now();
  let llmMs = 0;

  const body = await req.json();
  const rawResume = typeof body?.resume === "string" ? body.resume : "";
  const rawJobDescription =
    typeof body?.jobDescription === "string" ? body.jobDescription : "";
  const resumeId = typeof body?.resumeId === "string" ? body.resumeId : null;

  const cleanedResume = (removeNullChars(rawResume) as string).trim();
  const cleanedJobDescription = (removeNullChars(rawJobDescription) as string).trim();

  if (!cleanedResume || !cleanedJobDescription) {
    return Response.json(
      { error: "Resume and job description are required." },
      { status: 400 },
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

  const result: {
    mode: typeof TAILOR_MODES.COVER_LETTER_ONLY;
    data: CoverLetterResultData;
  } = cached
    ? {
        mode: TAILOR_MODES.COVER_LETTER_ONLY,
        data: cached as CoverLetterResultData,
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
        };
      });

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
