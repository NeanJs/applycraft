import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { syncUser } from "@/app/lib/sync-user";
import { parseJobContext } from "@/app/helpers/parseJobContext";
import { resumeBelongsToUser } from "@/app/lib/tracker/resume-ownership";
import { parseOptionalString, readJsonRecord } from "@/app/lib/tracker/validation";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await syncUser();
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const body = await readJsonRecord(req);
  if (!body) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const generationId = parseOptionalString(body.generationId);
  const jobDescription = parseOptionalString(body.jobDescription);
  const resumeId = parseOptionalString(body.resumeId);
  const title = parseOptionalString(body.title);
  const company = parseOptionalString(body.company);
  const role = parseOptionalString(body.role);
  const jobUrl = parseOptionalString(body.jobUrl);
  const jobId = parseOptionalString(body.jobId);
  if (
    !generationId.valid ||
    !jobDescription.valid ||
    !resumeId.valid ||
    !title.valid ||
    !company.valid ||
    !role.valid ||
    !jobUrl.valid ||
    !jobId.valid
  ) {
    return Response.json({ error: "Invalid request fields." }, { status: 400 });
  }

  const inferred = parseJobContext(jobDescription.value ?? "");
  const normalizedCompany =
    company.value ?? (inferred.company.trim() || null);
  const normalizedRole = role.value ?? (inferred.role.trim() || null);
  const normalizedJobDescription = jobDescription.value;
  const normalizedJobUrl = jobUrl.value;
  const normalizedResumeId = resumeId.value;
  const linkedNote = `Linked from ${title.value ?? "tool run"}`;

  if (
    normalizedResumeId &&
    !(await resumeBelongsToUser(normalizedResumeId, user.id))
  ) {
    return Response.json({ error: "Resume not found." }, { status: 404 });
  }

  if (jobId.value) {
    const existing = await prisma.jobApplication.findFirst({
      where: { id: jobId.value, userId: user.id },
      include: {
        resumeVersion: {
          select: { userId: true },
        },
      },
    });

    if (!existing) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const job = await prisma.jobApplication.update({
      where: { id: jobId.value },
      data: {
        company: existing.company ?? normalizedCompany,
        role: existing.role ?? normalizedRole,
        jobUrl: existing.jobUrl ?? normalizedJobUrl,
        jobDescription: existing.jobDescription ?? normalizedJobDescription,
        resumeVersionId:
          normalizedResumeId ??
          (existing.resumeVersion?.userId === user.id
            ? existing.resumeVersionId
            : null),
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
      notes: title.value ? `Linked from ${title.value}` : null,
    },
    include: {
      resumeVersion: {
        select: { id: true, title: true, createdAt: true },
      },
    },
  });

  if (generationId.value) {
    await prisma.generation.updateMany({
      where: { id: generationId.value, userId: user.id },
      data: { companyName: normalizedCompany, jobTitle: normalizedRole },
    });
  }

  return Response.json({ job });
}
