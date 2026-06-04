import ResumeResults from "@/app/components/ResumeResults";
import { prisma } from "@/app/lib/prisma";
import { ResumeData } from "@/app/types/types";

import { auth } from "@clerk/nextjs/server";

import { notFound } from "next/navigation";

interface ResumePageProps {
  params: {
    id: string;
  };
}

export default async function ResumePage({ params }: ResumePageProps) {
  const { id } = params;
  const { userId } = await auth();

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId! },
  });
  const resume = await prisma.resume.findFirst({
    where: {
      id,
      userId: dbUser?.id,
    },
  });

  if (!resume || !resume.data) {
    return notFound();
  }
  const typedResume = resume.data as unknown as ResumeData;
  const result = {
    atsScore: resume.atsScore,
    optimizedResume: typedResume,
    missingKeywords: resume.missingKeywords,
    coverLetter: resume.coverLetter ?? "",
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-full mx-auto mb-4 flex justify-between items-center p-4">
        <h1 className="text-lg font-semibold text-black">
          {resume.title || "Untitled Resume"}
        </h1>

        <div className="flex gap-2 text-black">
          <a
            href={`/resume/${id}/edit`}
            className="text-sm px-3 py-1 border rounded"
          >
            Edit
          </a>

          <a
            href={`/resume/${id}/preview`}
            className="text-sm px-3 py-1 border rounded"
          >
            Preview
          </a>
        </div>
      </div>

      {/* Resume */}
      <ResumeResults result={result} copied={false} />
    </div>
  );
}
