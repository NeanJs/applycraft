import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { syncUser } from "@/app/lib/sync-user";
import { parseJobContext } from "@/app/helpers/parseJobContext";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await syncUser();
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const body = await req.json();
  const { generationId, jobDescription, resumeId, title, company, role, jobId } = body;

  if (jobId) {
    const existing = await prisma.jobApplication.findFirst({
      where: { id: jobId, userId: user.id },
    });

    if (!existing) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const job = await prisma.jobApplication.update({
      where: { id: jobId },
      data: {
        resumeVersionId: resumeId || existing.resumeVersionId || null,
        notes: existing.notes ? `${existing.notes}\nLinked from ${title ?? "tool run"}` : `Linked from ${title ?? "tool run"}`,
      },
      include: {
        resumeVersion: {
          select: { id: true, title: true, createdAt: true },
        },
      },
    });

    return Response.json({ job });
  }

  const inferred = parseJobContext(jobDescription);
  const existing = await prisma.jobApplication.findFirst({
    where: { userId: user.id, resumeVersionId: resumeId ?? undefined },
  });

  if (existing) {
    return Response.json({ job: existing });
  }

  const job = await prisma.jobApplication.create({
    data: {
      userId: user.id,
      company: company?.trim() || inferred.company || null,
      role: role?.trim() || inferred.role || null,
      jobDescription: jobDescription?.trim() || null,
      status: "SAVED",
      resumeVersionId: resumeId || null,
      notes: title ? `Linked from ${title}` : null,
    },
    include: {
      resumeVersion: {
        select: { id: true, title: true, createdAt: true },
      },
    },
  });

  if (generationId) {
    await prisma.generation.update({
      where: { id: generationId },
      data: { companyName: company?.trim() || inferred.company || null, jobTitle: role?.trim() || inferred.role || null },
    });
  }

  return Response.json({ job });
}
