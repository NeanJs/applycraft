import { prisma } from "@/app/lib/prisma";
import ResumeTemplate from "@/app/template/resume-template";
import { ResumeData } from "@/app/types/types";
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";

export default async function PrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;

  if (!token) notFound();

  try {
    const payload = jwt.verify(token, process.env.PRINT_TOKEN_SECRET!) as {
      resumeId: string;
    };

    if (payload.resumeId !== id) notFound();
  } catch {
    notFound();
  }

  const resume = await prisma.resume.findUnique({ where: { id } });
  if (!resume) notFound();

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
