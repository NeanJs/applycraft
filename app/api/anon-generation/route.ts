import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { syncUser } from "@/app/lib/sync-user";

export async function POST(req: Request) {
  const { userId } = await auth();
  const body = await req.json();
  const { sessionKey, toolType, input, result } = body;

  if (!sessionKey || !toolType) {
    return Response.json({ error: "Missing session data" }, { status: 400 });
  }

  const dbUser = userId ? await syncUser() : null;

  await prisma.anonGeneration.create({
    data: {
      sessionKey,
      toolType,
      input,
      result,
      userId: dbUser?.id ?? null,
    },
  });

  return Response.json({ ok: true });
}
