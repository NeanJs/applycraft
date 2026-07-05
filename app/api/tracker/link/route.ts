import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { syncUser } from "@/app/lib/sync-user";
import { parseJobContext } from "@/app/helpers/parseJobContext";

function normalize(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

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
  const { generationId, jobDescription, resumeId, title, company, role, jobUrl, jobId } = body;
  const inferred = parseJobContext(jobDescription);
  const normalizedCompany = normalize(company) ?? normalize(inferred.company);
  const normalizedRole = normalize(role) ?? normalize(inferred.role);
  const normalizedJobDescription = normalize(jobDescription);
  const normalizedJobUrl = normalize(jobUrl);
  const normalizedResumeId = normalize(resumeId);
  const linkedNote = `Linked from ${title ?? "tool run"}`;

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
        company: existing.company ?? normalizedCompany,
        role: existing.role ?? normalizedRole,
        jobUrl: existing.jobUrl ?? normalizedJobUrl,
        jobDescription: existing.jobDescription ?? normalizedJobDescription,
        resumeVersionId: normalizedResumeId ?? existing.resumeVersionId,
        notes: existing.notes ? `${existing.notes}\n${linkedNote}` : linkedNote,
      },
      include: {
        resumeVersion: {
          select: { id: true, title: true, createdAt: true },
        },
      },
    });

    return Response.json({ job });
  }

  if (normalizedResumeId) {
    const existing = await prisma.jobApplication.findFirst({
      where: { userId: user.id, resumeVersionId: normalizedResumeId },
    });

    if (existing) {
      const job = await prisma.jobApplication.update({
        where: { id: existing.id },
        data: {
          company: existing.company ?? normalizedCompany,
          role: existing.role ?? normalizedRole,
          jobUrl: existing.jobUrl ?? normalizedJobUrl,
          jobDescription: existing.jobDescription ?? normalizedJobDescription,
          notes: existing.notes ? `${existing.notes}\n${linkedNote}` : linkedNote,
        },
        include: {
          resumeVersion: {
            select: { id: true, title: true, createdAt: true },
          },
        },
      });

      return Response.json({ job });
    }
  }

  const job = await prisma.jobApplication.create({
    data: {
      userId: user.id,
      company: normalizedCompany,
      role: normalizedRole,
      jobUrl: normalizedJobUrl,
      jobDescription: normalizedJobDescription,
      status: "SAVED",
      resumeVersionId: normalizedResumeId,
      notes: title ? `Linked from ${title}` : null,
    },
    include: {
      resumeVersion: {
        select: { id: true, title: true, createdAt: true },
      },
    },
  });

  if (generationId) {
    await prisma.generation.updateMany({
      where: { id: generationId, userId: user.id },
      data: { companyName: normalizedCompany, jobTitle: normalizedRole },
    });
  }

  return Response.json({ job });
}
