import { callClaude } from "./claude";

import { parseClaudeResponse, ParseClaudeResponseError } from "./parser";

import { BASE_SYSTEM_PROMPT } from "./prompts/base";
import { MODE_CONFIG, TailorMode } from "./prompts/modes/modes";

const JSON_REPAIR_SYSTEM_PROMPT = `You are a strict JSON repair service.
Return only valid JSON with no markdown, no explanation, and no surrounding text.
Preserve the original schema and values as much as possible.
If the input is truncated or malformed, repair it into a syntactically valid JSON object.`;

export async function runTailorEngine({
  resume,
  jobDescription,
  mode = "full_optimizer",
  includeCoverLetter = true,
}: {
  resume: string;
  jobDescription: string;
  mode?: TailorMode;
  includeCoverLetter?: boolean;
}) {
  const config = MODE_CONFIG[mode];

  const modePrompt = config.prompt;

  const systemPrompt = `${BASE_SYSTEM_PROMPT}\n---\n${modePrompt}`;

  const compactResume = resume.slice(0, 5000);
  const compactJD = jobDescription.slice(0, 3000);

  const payload = {
    includeCoverLetter,
    resume: compactResume,
    jobDescription: compactJD,
  };

  const response = await callClaude({
    system: systemPrompt,
    maxTokens: config.maxTokens,
    messages: [
      {
        role: "user",
        content: JSON.stringify(payload),
      },
    ],
  });

  let parsed: unknown;

  try {
    parsed = parseClaudeResponse(response);
  } catch (error) {
    if (!(error instanceof ParseClaudeResponseError)) {
      throw error;
    }

    const repairInput =
      error.cleanedText && error.cleanedText.length > 0
        ? error.cleanedText
        : error.rawText;

    const repairedResponse = await callClaude({
      system: JSON_REPAIR_SYSTEM_PROMPT,
      maxTokens: Math.max(1400, config.maxTokens),
      messages: [
        {
          role: "user",
          content: `Repair this JSON so it is valid and return only JSON:\n\n${repairInput.slice(0, 18000)}`,
        },
      ],
    });

    parsed = parseClaudeResponse(repairedResponse);
  }

  return {
    mode,
    data: parsed,
  };
}
