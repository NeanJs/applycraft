import { auth } from "@clerk/nextjs/server";
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
import { TAILOR_MODES } from "@/app/lib/ai/prompts/modes/modes";

export async function POST(req: Request) {
  const body = await req.json();
  const rawResume = typeof body?.resume === "string" ? body.resume : "";
  const rawJobDescription =
    typeof body?.jobDescription === "string" ? body.jobDescription : "";
  const mode = body?.mode ?? TAILOR_MODES.FULL_OPTIMIZER;

  const resume = removeNullChars(rawResume) as string;
  const jobDescription = removeNullChars(rawJobDescription) as string;

  const requiresJobDescription =
    mode !== TAILOR_MODES.SUMMARY_ONLY && mode !== TAILOR_MODES.BULLET_IMPROVER;
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

  const result = await runTailorEngine({
    resume: cleanedResume,
    jobDescription: cleanedJobDescription,
    mode,
  });
  const generationMeta = getGenerationMeta(result.mode, result.data.job);

  let saved = false;
  let resumeData = null;
  let generationData = null;

  if (dbUser && result.mode === TAILOR_MODES.FULL_OPTIMIZER) {
    const safeResultData = removeNullChars(result.data) as typeof result.data;

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
        atsBefore: safeResultData.atsBefore,
        atsAfter: safeResultData.atsAfter,
        atsBreakdown: safeResultData.atsBreakdown,
        optimizedResume: safeResultData.optimizedResume,
        coverLetter: safeResultData.coverLetter,
        missingKeywords: safeResultData.missingKeywords ?? [],
        changesMade: safeResultData.changesMade ?? [],
        confidenceScore: safeResultData.confidenceScore,
        jobType: safeResultData.JobType,
        generations: safeResultData.generations,
      },
    });

    generationData = await saveGeneration({
      userId: dbUser.id,
      resumeId: resumeData.id,
      type: generationMeta.type,
      title: generationMeta.title,
      result: safeResultData,
      input: {
        resume: cleanedResume,
        jobDescription: cleanedJobDescription,
      },
    });

    saved = true;
  }
  console.log(Response);
  return Response.json({
    ...result.data,
    mode: result.mode,
    saved,
    promptSignUp: !dbUser,
    resumeId: resumeData?.id ?? null,
    generationId: generationData?.id ?? null,
  });
}
