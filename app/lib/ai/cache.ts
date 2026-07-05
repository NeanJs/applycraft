import { prisma } from "@/app/lib/prisma";
import { TailorMode } from "@/app/lib/ai/prompts/modes/modes";
import { Prisma } from "@prisma/client";

type CacheResult = Record<string, unknown>;

type CacheLookupInput = {
  mode: TailorMode;
  includeCoverLetter: boolean;
  hash: string;
  maxAgeMs?: number;
};

type CacheWriteInput = {
  mode: TailorMode;
  includeCoverLetter: boolean;
  hash: string;
  result: CacheResult;
  promptVersion: string;
};

function buildToolType(mode: TailorMode, includeCoverLetter: boolean) {
  return `cache:tailor:${mode}:${includeCoverLetter ? "1" : "0"}`;
}

export async function getCachedTailorResult({
  mode,
  includeCoverLetter,
  hash,
  maxAgeMs = 24 * 60 * 60 * 1000,
}: CacheLookupInput): Promise<CacheResult | null> {
  const minCreatedAt = new Date(Date.now() - maxAgeMs);

  const cached = await prisma.anonGeneration.findFirst({
    where: {
      sessionKey: hash,
      toolType: buildToolType(mode, includeCoverLetter),
      createdAt: {
        gte: minCreatedAt,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      result: true,
    },
  });

  if (!cached || !cached.result || typeof cached.result !== "object") {
    return null;
  }

  return cached.result as CacheResult;
}

export async function setCachedTailorResult({
  mode,
  includeCoverLetter,
  hash,
  result,
  promptVersion,
}: CacheWriteInput) {
  await prisma.anonGeneration.create({
    data: {
      sessionKey: hash,
      toolType: buildToolType(mode, includeCoverLetter),
      input: {
        hash,
        mode,
        includeCoverLetter,
        promptVersion,
      },
      result: result as unknown as Prisma.InputJsonValue,
    },
  });
}
