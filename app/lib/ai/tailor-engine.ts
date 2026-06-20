import { callClaude } from "./claude";

import { parseClaudeResponse } from "./parser";

import { BASE_SYSTEM_PROMPT } from "./prompts/base";
import { MODE_CONFIG, TailorMode } from "./prompts/modes/modes";

export async function runTailorEngine({
  resume,
  jobDescription,
  mode = "full_optimizer",
}: {
  resume: string;
  jobDescription: string;
  mode?: TailorMode;
}) {
  const config = MODE_CONFIG[mode];

  const modePrompt = config.prompt;

  const systemPrompt = `
${BASE_SYSTEM_PROMPT}
---

${modePrompt}
  `;

  const response = await callClaude({
    system: systemPrompt,
    maxTokens: config.maxTokens,
    messages: [
      {
        role: "user",
        content: `
RESUME:
${resume.slice(0, 5000)}

JOB DESCRIPTION:
${
  jobDescription?.trim()
    ? `JOB DESCRIPTION:
${jobDescription.slice(0, 3000)}`
    : ""
}
        `,
      },
    ],
  });

  const parsed = parseClaudeResponse(response);

  return {
    mode,
    data: parsed,
  };
}
