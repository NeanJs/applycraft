import { prisma } from "@/app/lib/prisma";
import ResumeTemplate from "@/app/template/resume-template";
import { ResumeData } from "@/app/types/types";

export default async function PrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <div>No resume id found</div>;
  }

  const resume = await prisma.resume.findUnique({
    where: { id },
  });

  if (!resume) {
    return <div>Resume not found</div>;
  }

  return (
    <>
      <style>{`
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        @page { size: A4; margin: 0; }
        body { margin: 0; padding: 0; }
      `}</style>
      <div className="w-[210mm] min-h-[297mm] bg-white px-10 py-10 text-sm">
        <ResumeTemplate
          resumeData={resume.optimizedResume as unknown as ResumeData}
        />
      </div>
    </>
  );
}
