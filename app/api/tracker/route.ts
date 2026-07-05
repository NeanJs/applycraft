import { auth } from "@clerk/nextjs/server";
import { JobApplicationStatus } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { syncUser } from "@/app/lib/sync-user";

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
        select: { id: true, title: true, createdAt: true },
      },
    },
  });

  return Response.json({ jobs });
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
  const { company, role, jobUrl, jobDescription, status, resumeVersionId, notes } = body;
  const parsedStatus = status ? parseStatus(status) : JobApplicationStatus.SAVED;

  if (!parsedStatus) {
    return Response.json({ error: "Invalid status value." }, { status: 400 });
  }

  const job = await prisma.jobApplication.create({
    data: {
      userId: user.id,
      company: company?.trim() || null,
      role: role?.trim() || null,
      jobUrl: jobUrl?.trim() || null,
      jobDescription: jobDescription?.trim() || null,
      status: parsedStatus ,
      resumeVersionId: resumeVersionId?.trim() || null,
      notes: notes?.trim() || null,
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

  const body = await req.json();
  const { id, ...data } = body;

  if (!id || typeof id !== "string") {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const hasOwn = (key: string) => Object.prototype.hasOwnProperty.call(data, key);

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
    const parsed = parseStatus(data.status);
    if (!parsed) {
      return Response.json({ error: "Invalid status value." }, { status: 400 });
    }
    updateData.status = parsed;
  }
  if (hasOwn("company")) {
    updateData.company = data.company?.trim() || null;
  }
  if (hasOwn("role")) {
    updateData.role = data.role?.trim() || null;
  }
  if (hasOwn("jobUrl")) {
    updateData.jobUrl = data.jobUrl?.trim() || null;
  }
  if (hasOwn("jobDescription")) {
    updateData.jobDescription = data.jobDescription?.trim() || null;
  }
  if (hasOwn("notes")) {
    updateData.notes = data.notes?.trim() || null;
  }
  if (hasOwn("resumeVersionId")) {
    updateData.resumeVersionId = data.resumeVersionId?.trim() || null;
  }

  const existing = await prisma.jobApplication.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const job = await prisma.jobApplication.update({
    where: { id },
    data: {
      ...updateData,
      appliedAt:
        data.status === "APPLIED" && !existing.appliedAt
          ? new Date()
          : hasOwn("appliedAt")
            ? (data.appliedAt ? new Date(data.appliedAt) : null)
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
