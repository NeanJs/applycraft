import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId } = await req.json();

    if (!resumeId) {
      return Response.json({ error: "Missing resumeId" }, { status: 400 });
    }

    // get DB user
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // verify ownership
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: dbUser.id,
      },
    });

    if (!resume) {
      return Response.json({ error: "Resume not found" }, { status: 404 });
    }

    // delete
    await prisma.resume.delete({
      where: { id: resumeId },
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);

    return Response.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}
