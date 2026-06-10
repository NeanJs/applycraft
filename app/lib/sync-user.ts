import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
export async function syncUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  // Check if this email belongs to a different clerkId
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing && existing.clerkId !== userId) {
    // Reassign to the current Clerk user
    return prisma.user.update({
      where: { email },
      data: { clerkId: userId },
    });
  }

  return prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: { clerkId: userId, email },
  });
}
