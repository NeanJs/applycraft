import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { syncUser } from "@/app/lib/sync-user";

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

  const job = await prisma.jobApplication.create({
    data: {
      userId: user.id,
      company: company?.trim() || null,
      role: role?.trim() || null,
      jobUrl: jobUrl?.trim() || null,
      jobDescription: jobDescription?.trim() || null,
      status: status || "SAVED",
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

  const existing = await prisma.jobApplication.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const job = await prisma.jobApplication.update({
    where: { id },
    data: {
      ...data,
      company: data.company?.trim() || null,
      role: data.role?.trim() || null,
      jobUrl: data.jobUrl?.trim() || null,
      jobDescription: data.jobDescription?.trim() || null,
      notes: data.notes?.trim() || null,
      resumeVersionId: data.resumeVersionId?.trim() || null,
      appliedAt: data.status === "APPLIED" && !existing.appliedAt ? new Date() : existing.appliedAt,
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
