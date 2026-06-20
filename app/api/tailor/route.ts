import { auth } from "@clerk/nextjs/server";
import { runTailorEngine } from "@/app/lib/ai/tailor-engine";
import {
  getClientIP,
  checkAnonRateLimit,
} from "@/app/helpers/checkAnonRateLimit";
import { saveGeneration } from "@/app/lib/saveGeneration";
import { prisma } from "@/app/lib/prisma";

import { getGenerationMeta } from "@/app/helpers/getGenerationMeta";
import { TAILOR_MODES } from "@/app/lib/ai/prompts/modes/modes";

export async function POST(req: Request) {
  const { resume, jobDescription, mode } = await req.json();
  const requiresJobDescription =
    mode !== TAILOR_MODES.SUMMARY_ONLY && mode !== TAILOR_MODES.BULLET_IMPROVER;
  if (!resume?.trim()) {
    return Response.json({ error: "Resume is required." }, { status: 400 });
  }

  if (requiresJobDescription && !jobDescription?.trim()) {
    return Response.json(
      { error: "Resume and job description are required." },
      { status: 400 },
    );
  }

  const { userId } = await auth();
  const dbUser = userId
    ? await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
      })
    : null;
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
    resume,
    jobDescription,
    mode: mode ?? "full_optimizer",
  });
  const generationMeta = getGenerationMeta(result.mode);

  let saved = false;
  let resumeData = null;
  let generationData = null;

  if (dbUser && result.mode === "full_optimizer") {
    resumeData = await prisma.resume.create({
      data: {
        user: {
          connect: {
            id: dbUser.id,
          },
        },
        originalResume: resume,
        jobDescription,
        title: generationMeta.title,
        atsBefore: result.data.atsBefore,
        atsAfter: result.data.atsAfter,
        optimizedResume: result.data.optimizedResume,
        coverLetter: result.data.coverLetter,
        missingKeywords: result.data.missingKeywords ?? [],
        changesMade: result.data.changesMade ?? [],
      },
    });

    generationData = await saveGeneration({
      userId: dbUser.id,
      resumeId: resumeData.id,
      type: generationMeta.type,
      title: generationMeta.title,
      result: result.data,
      input: {
        resume,
        jobDescription,
      },
    });

    saved = true;
  }
  return Response.json({
    ...result.data,
    mode: result.mode,
    saved,
    promptSignUp: !dbUser,
    resumeId: resumeData?.id ?? null,
    generationId: generationData?.id ?? null,
  });
}
