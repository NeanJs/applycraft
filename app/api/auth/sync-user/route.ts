import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    return NextResponse.json({ ok: false, error: "Email missing" }, { status: 400 });
  }

  try {
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: { email },
      create: { clerkId: userId, email },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to sync user", error);
    return NextResponse.json({ ok: false, error: "Sync failed" }, { status: 500 });
  }
}
