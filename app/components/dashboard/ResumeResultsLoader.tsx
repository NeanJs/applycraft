import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { parseATSBreakdown, ResumeData } from "@/app/types/types";
import { formatDistanceToNow } from "date-fns";
import ResumeResults from "./ResumeResults";
import { getResumeDisplayTitle } from "@/app/helpers/resumeTitle";

export default async function ResumeResultsLoader({
  userId,
  resumeId,
}: {
  userId: string;
  resumeId: string;
}) {
  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!dbUser) return notFound();

  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId: dbUser.id },
    include: {
      generations: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          jobTitle: true,
          companyName: true,
        },
      },
    },
  });
  if (!resume?.optimizedResume) return notFound();

  const typedResume = resume.optimizedResume as unknown as ResumeData;
  const resumeTitle = getResumeDisplayTitle(
    resume.title,
    resume.generations[0],
  );

  const result = {
    jobType: resume.jobType as "corporate" | "startup" | "leadership",

    atsBefore: resume.atsBefore,
    atsAfter: resume.atsAfter,
    atsBreakdown: parseATSBreakdown(resume.atsBreakdown),
    optimizedResume: typedResume,
    missingKeywords: resume.missingKeywords,
    coverLetter: resume.coverLetter ?? "",

    changesMade: resume.changesMade,
    confidenceScore: resume.confidenceScore ?? undefined,
    resumeId: resume.id,
    saved: true,
    promptSignup: false,
  };

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {resumeTitle}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Generated{" "}
            {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              timeZone: "UTC",
              timeZoneName: "short",
            }).format(resume.createdAt)}
            {" · "}
            {formatDistanceToNow(new Date(resume.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
      <ResumeResults result={result} resumeID={resumeId} copied={false} />
    </>
  );
}
