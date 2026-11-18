import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 },
      );
    }

    const primaryEmail = clerkUser.emailAddresses.find(
      (address) => address.id === clerkUser.primaryEmailAddressId,
    );

    const email = primaryEmail?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Primary email missing" },
        { status: 400 },
      );
    }

    // Check whether this Clerk account already exists.
    const existingClerkUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // Check whether another database account owns this email.
    const existingEmailUser = await prisma.user.findUnique({
      where: { email },
    });

    // Never silently merge or overwrite different accounts.
    if (existingEmailUser && existingEmailUser.clerkId !== userId) {
      console.error("Account sync conflict:", {
        email,
        incomingClerkId: userId,
        existingClerkId: existingEmailUser.clerkId,
      });

      return NextResponse.json(
        {
          ok: false,
          error: "EMAIL_ALREADY_LINKED",
          message:
            "This email is already associated with another account. Account verification is required.",
        },
        { status: 409 },
      );
    }

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { email },
      create: {
        clerkId: userId,
        email,
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
      },
    });

    return NextResponse.json({
      ok: true,
      user,
      isNewUser: !existingClerkUser,
    });
  } catch (error) {
    console.error("Failed to sync user:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      console.error("Prisma unique constraint violation:", {
        code: error.code,
        modelName: error.meta?.modelName,
        target: error.meta?.target,
        meta: error.meta,
      });

      return NextResponse.json(
        {
          ok: false,
          error: "ACCOUNT_CONFLICT",
          message: "An account with this information already exists.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { ok: false, error: "Sync failed" },
      { status: 500 },
    );
  }
}
