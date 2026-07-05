import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { syncUser } from "@/app/lib/sync-user";
import { Prisma } from "@/app/generated/prisma/client";

type EventPayload = {
  name?: string;
  properties?: Record<string, unknown>;
  sessionKey?: string;
};

function safeName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, 80);
}

function safeSessionKey(value: unknown): string {
  if (typeof value !== "string") return "anon";
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 120) : "anon";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as EventPayload;
    const eventName = safeName(body.name);

    if (!eventName) {
      return Response.json({ error: "Invalid event name" }, { status: 400 });
    }

    const sessionKey = safeSessionKey(body.sessionKey);

    let userId: string | undefined;
    const authState = await auth();
    if (authState.userId) {
      const user = await syncUser();
      userId = user?.id;
    }

    await prisma.anonGeneration.create({
      data: {
        sessionKey,
        toolType: `event:${eventName}`,
        input: (body.properties as Prisma.InputJsonValue) ?? {},
        result: { ok: true },
        userId,
      },
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
