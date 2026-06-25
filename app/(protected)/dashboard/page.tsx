import { prisma } from "@/app/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import DashboardUI from "@/app/components/dashboard/DashboardUI";

async function getResumes(userId: string) {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      atsBefore: true,
      atsAfter: true,
      confidenceScore: true,
    },
  });
}
async function getRecentGenerations(userId: string) {
  return prisma.generation.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    select: {
      id: true,
      type: true,
      title: true,
      jobTitle: true,
      companyName: true,
      createdAt: true,
    },
  });
}
export async function getDbUser(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerkId },
  });
}

export default async function DashboardPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  const dbUser = await getDbUser(clerkUser.id);

  if (!dbUser) {
    return null;
  }

  const [resumes, generations] = await Promise.all([
    getResumes(dbUser.id),
    getRecentGenerations(dbUser.id),
  ]);

  const firstName = clerkUser?.firstName ?? "there";

  return (
    <DashboardUI
      resumes={resumes}
      generations={generations}
      firstName={firstName ?? "there"}
    />
  );
}
