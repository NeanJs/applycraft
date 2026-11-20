import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function syncUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const primaryEmail = clerkUser.emailAddresses.find(
    (address) => address.id === clerkUser.primaryEmailAddressId,
  );
  const email = primaryEmail?.emailAddress;
  if (!email) return null;

  const existingEmailUser = await prisma.user.findUnique({
    where: { email },
    select: { clerkId: true },
  });
  if (existingEmailUser && existingEmailUser.clerkId !== userId) return null;

  return prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: { clerkId: userId, email },
  });
}
