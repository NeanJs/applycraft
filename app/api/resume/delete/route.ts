import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await req.json();
    const resumeId =
      typeof body === "object" &&
      body !== null &&
      "resumeId" in body &&
      typeof body.resumeId === "string"
        ? body.resumeId
        : "";

    if (!resumeId.trim()) {
      return Response.json({ error: "Missing resumeId" }, { status: 400 });
    }

    // get DB user
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const deleted = await prisma.$transaction(async (tx) => {
      const resume = await tx.resume.findFirst({
        where: {
          id: resumeId,
          userId: dbUser.id,
        },
        select: { id: true },
      });

      if (!resume) return false;

      await tx.generation.deleteMany({
        where: {
          resumeId: resume.id,
          userId: dbUser.id,
        },
      });
      await tx.resume.delete({
        where: { id: resume.id },
      });

      return true;
    });

    if (!deleted) {
      return Response.json({ error: "Resume not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);

    return Response.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}
