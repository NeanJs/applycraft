import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function syncUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  return prisma.user.upsert({
    where: {
      clerkId: clerkUser.id,
    },
    update: {
      email: clerkUser.emailAddresses[0].emailAddress,
    },
    create: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
    },
  });
}
