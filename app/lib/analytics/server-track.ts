import { prisma } from "@/app/lib/prisma";

type AIRequestMetricInput = {
  sessionKey: string;
  route: "tailor" | "cover-letter";
  mode: string;
  cacheHit: boolean;
  totalMs: number;
  llmMs: number;
  dbMs?: number;
  promptVersion: string;
  userId?: string;
  inputTokens?: number;
  outputTokens?: number;
  cacheReadTokens?: number;
  cacheCreationTokens?: number;
};

export function logAIRequestMetric(input: AIRequestMetricInput) {
  void prisma.anonGeneration
    .create({
      data: {
        sessionKey: input.sessionKey,
        toolType: "event:ai_request",
        userId: input.userId,
        input: {
          route: input.route,
          mode: input.mode,
          cacheHit: input.cacheHit,
          totalMs: input.totalMs,
          llmMs: input.llmMs,
          dbMs: input.dbMs ?? 0,
          promptVersion: input.promptVersion,
          inputTokens: input.inputTokens ?? 0,
          outputTokens: input.outputTokens ?? 0,
          cacheReadTokens: input.cacheReadTokens ?? 0,
          cacheCreationTokens: input.cacheCreationTokens ?? 0,
        },
        result: { ok: true },
      },
    })
    .catch((error: unknown) => {
      console.error("Failed to persist AI request metrics:", error);
    });
}
