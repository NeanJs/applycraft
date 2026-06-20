import { SampleResumeData } from "@/app/constant/data";
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
  searchParams: Promise<{ printToken?: string }>;
}) {
  const { id } = await params;
  // const { printToken } = await searchParams;

  // if (!printToken) {
  //   console.log("404: Missing print token");

  //   notFound();
  // }
  console.log(params);
  // try {
  //   const payload = jwt.verify(printToken, process.env.PRINT_TOKEN_SECRET!) as {
  //     resumeId: string;
  //   };

  //   if (payload.resumeId !== id) notFound();
  // } catch {
  //   notFound();
  // }

  console.log("PRINT PAGE RESUME ID:", id);
  const resume = await prisma.resume.findUnique({ where: { id } });

  console.log("RESUME FOUND:", !!resume);
  if (!resume) {
    console.log("missing resume");
    notFound();
  }

  return (
    <>
      <div className="w-[210mm] min-h-[297mm] bg-white px-10 pb-10 text-sm">
        <ResumeTemplate
          resumeData={resume.optimizedResume as unknown as ResumeData}
        />
      </div>
    </>
  );
}
