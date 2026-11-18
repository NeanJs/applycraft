import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { syncUser } from "@/app/lib/sync-user";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await syncUser();
    if (!dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const { count } = await prisma.generation.deleteMany({
      where: { userId: dbUser.id },
    });

    return Response.json({ success: true, deletedCount: count });
  } catch (error) {
    console.error("Failed to clear generation activity:", error);
    return Response.json(
      { error: "Failed to clear recent activity" },
      { status: 500 },
    );
  }
}
