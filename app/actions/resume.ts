"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { syncUser } from "@/app/lib/sync-user";

export async function createResume() {
  const user = await syncUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      title: "Untitled Resume",
      data: {},
    },
  });

  redirect(`/resume/${resume.id}`);
}
