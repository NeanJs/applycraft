import ResumeTemplate from "@/app/template/resume-template";
import { prisma } from "@/app/lib/prisma";
import { ResumeData } from "@/app/types/types";

export default async function PrintPage({
  params,
}: {
  params: { id: string };
}) {
  const resume = await prisma.resume.findUnique({
    where: { id: params.id },
  });

  if (!resume) {
    return <div>Resume not found</div>;
  }

  return (
    <div id="resume-template">
      <ResumeTemplate resumeData={resume.data as unknown as ResumeData} />
    </div>
  );
}
