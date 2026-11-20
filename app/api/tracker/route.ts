import { auth } from "@clerk/nextjs/server";
import { JobApplicationStatus } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { syncUser } from "@/app/lib/sync-user";
import { resumeBelongsToUser } from "@/app/lib/tracker/resume-ownership";
import {
  parseOptionalDate,
  parseOptionalString,
  readJsonRecord,
} from "@/app/lib/tracker/validation";

const VALID_STATUSES = new Set<JobApplicationStatus>([
  JobApplicationStatus.SAVED,
  JobApplicationStatus.APPLIED,
  JobApplicationStatus.INTERVIEW,
  JobApplicationStatus.OFFER,
  JobApplicationStatus.REJECTED,
]);

function parseStatus(value: unknown): JobApplicationStatus | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase() as JobApplicationStatus;
  return VALID_STATUSES.has(normalized) ? normalized : null;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await syncUser();
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const jobs = await prisma.jobApplication.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      resumeVersion: {
        select: { id: true, title: true, createdAt: true, userId: true },
      },
    },
  });

  return Response.json({
    jobs: jobs.map(({ resumeVersion, ...job }) => {
      const ownedResume = resumeVersion?.userId === user.id ? resumeVersion : null;
      return {
        ...job,
        resumeVersionId: ownedResume ? job.resumeVersionId : null,
        resumeVersion: ownedResume
          ? {
              id: ownedResume.id,
              title: ownedResume.title,
              createdAt: ownedResume.createdAt,
            }
          : null,
      };
    }),
  });
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

  const body = await readJsonRecord(req);
  if (!body) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const company = parseOptionalString(body.company);
  const role = parseOptionalString(body.role);
  const jobUrl = parseOptionalString(body.jobUrl);
  const jobDescription = parseOptionalString(body.jobDescription);
  const resumeVersionId = parseOptionalString(body.resumeVersionId);
  const notes = parseOptionalString(body.notes);
  if (
    !company.valid ||
    !role.valid ||
    !jobUrl.valid ||
    !jobDescription.valid ||
    !resumeVersionId.valid ||
    !notes.valid
  ) {
    return Response.json({ error: "Invalid request fields." }, { status: 400 });
  }

  const parsedStatus =
    body.status === undefined || body.status === null
      ? JobApplicationStatus.SAVED
      : parseStatus(body.status);

  if (!parsedStatus) {
    return Response.json({ error: "Invalid status value." }, { status: 400 });
  }

  if (
    resumeVersionId.value &&
    !(await resumeBelongsToUser(resumeVersionId.value, user.id))
  ) {
    return Response.json({ error: "Resume not found." }, { status: 404 });
  }

  const job = await prisma.jobApplication.create({
    data: {
      userId: user.id,
      company: company.value,
      role: role.value,
      jobUrl: jobUrl.value,
      jobDescription: jobDescription.value,
      status: parsedStatus,
      resumeVersionId: resumeVersionId.value,
      notes: notes.value,
    },
    include: {
      resumeVersion: {
        select: { id: true, title: true, createdAt: true },
      },
    },
  });

  return Response.json({ job });
}

export async function PATCH(req: Request) {
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

  const parsedId = parseOptionalString(body.id);
  if (!parsedId.valid || !parsedId.value) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }
  const id = parsedId.value;

  const hasOwn = (key: string) => Object.prototype.hasOwnProperty.call(body, key);

  const updateData: {
    status?: JobApplicationStatus;
    company?: string | null;
    role?: string | null;
    jobUrl?: string | null;
    jobDescription?: string | null;
    notes?: string | null;
    resumeVersionId?: string | null;
    appliedAt?: Date | null;
  } = {};

  if (hasOwn("status")) {
    const parsed = parseStatus(body.status);
    if (!parsed) {
      return Response.json({ error: "Invalid status value." }, { status: 400 });
    }
    updateData.status = parsed;
  }
  if (hasOwn("company")) {
    const parsed = parseOptionalString(body.company);
    if (!parsed.valid) {
      return Response.json({ error: "Invalid company value." }, { status: 400 });
    }
    updateData.company = parsed.value;
  }
  if (hasOwn("role")) {
    const parsed = parseOptionalString(body.role);
    if (!parsed.valid) {
      return Response.json({ error: "Invalid role value." }, { status: 400 });
    }
    updateData.role = parsed.value;
  }
  if (hasOwn("jobUrl")) {
    const parsed = parseOptionalString(body.jobUrl);
    if (!parsed.valid) {
      return Response.json({ error: "Invalid job URL value." }, { status: 400 });
    }
    updateData.jobUrl = parsed.value;
  }
  if (hasOwn("jobDescription")) {
    const parsed = parseOptionalString(body.jobDescription);
    if (!parsed.valid) {
      return Response.json({ error: "Invalid job description value." }, { status: 400 });
    }
    updateData.jobDescription = parsed.value;
  }
  if (hasOwn("notes")) {
    const parsed = parseOptionalString(body.notes);
    if (!parsed.valid) {
      return Response.json({ error: "Invalid notes value." }, { status: 400 });
    }
    updateData.notes = parsed.value;
  }
  if (hasOwn("resumeVersionId")) {
    const parsed = parseOptionalString(body.resumeVersionId);
    if (!parsed.valid) {
      return Response.json(
        { error: "Invalid resume version value." },
        { status: 400 },
      );
    }
    updateData.resumeVersionId = parsed.value;
    if (
      parsed.value &&
      !(await resumeBelongsToUser(parsed.value, user.id))
    ) {
      return Response.json({ error: "Resume not found." }, { status: 404 });
    }
  }
  let appliedAt: Date | null | undefined;
  if (hasOwn("appliedAt")) {
    const parsed = parseOptionalDate(body.appliedAt);
    if (!parsed.valid) {
      return Response.json({ error: "Invalid applied date value." }, { status: 400 });
    }
    appliedAt = parsed.value;
  }

  const existing = await prisma.jobApplication.findFirst({
    where: { id, userId: user.id },
    include: {
      resumeVersion: {
        select: { userId: true },
      },
    },
  });

  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  if (
    !hasOwn("resumeVersionId") &&
    existing.resumeVersionId &&
    existing.resumeVersion?.userId !== user.id
  ) {
    updateData.resumeVersionId = null;
  }

  const job = await prisma.jobApplication.update({
    where: { id },
    data: {
      ...updateData,
      appliedAt: hasOwn("appliedAt")
        ? appliedAt
        : updateData.status === JobApplicationStatus.APPLIED && !existing.appliedAt
          ? new Date()
          : existing.appliedAt,
    },
    include: {
      resumeVersion: {
        select: { id: true, title: true, createdAt: true },
      },
    },
  });

  return Response.json({ job });
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await syncUser();
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const existing = await prisma.jobApplication.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.jobApplication.delete({ where: { id } });
  return Response.json({ success: true });
}
