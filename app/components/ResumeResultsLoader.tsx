import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { ResumeData } from "@/app/types/types";
import { formatDistanceToNow } from "date-fns";
import ResumeResults from "./ResumeResults";

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
  });
  if (!resume?.data) return notFound();

  const typedResume = resume.data as unknown as ResumeData;

  const result = {
    atsScore: resume.atsScore,
    optimizedResume: typedResume,
    missingKeywords: resume.missingKeywords,
    coverLetter: resume.coverLetter ?? "",
  };

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {resume.title || "Untitled Resume"}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Analyzed{" "}
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
