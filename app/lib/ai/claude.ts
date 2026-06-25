import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function callClaude({
  system,
  messages,
  maxTokens,
}: {
  system: string;
  messages: any[];
  maxTokens: number;
}) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: maxTokens,
    system: [
      {
        cache_control: { type: "ephemeral", ttl: "1h" },
        type: "text",
        text: system,
      },
    ],
    messages,
  });

  return response;
}
