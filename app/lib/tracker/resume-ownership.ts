import { prisma } from "@/app/lib/prisma";

export async function resumeBelongsToUser(
  resumeId: string,
  userId: string,
): Promise<boolean> {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
    select: { id: true },
  });
  return resume !== null;
}
