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

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      updatedAt: true,
    },
    take: 200,
  });

  return Response.json({ resumes });
}