import { callClaude } from "./claude";

import { parseClaudeResponse } from "./parser";

import { BASE_SYSTEM_PROMPT } from "./prompts/base";
import { MODE_CONFIG, TailorMode } from "./prompts/modes/modes";
import {
  MAX_JOB_DESCRIPTION_CHARS,
  MAX_RESUME_CHARS,
  validateTailorOutput,
} from "./quality";

export class TailorInputLengthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TailorInputLengthError";
  }
}

export type AIUsage = {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheCreationTokens: number;
};

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
  if (resume.length > MAX_RESUME_CHARS) {
    throw new TailorInputLengthError(
      `Resume exceeds the ${MAX_RESUME_CHARS.toLocaleString()} character limit.`,
    );
  }
  if (jobDescription.length > MAX_JOB_DESCRIPTION_CHARS) {
    throw new TailorInputLengthError(
      `Job description exceeds the ${MAX_JOB_DESCRIPTION_CHARS.toLocaleString()} character limit.`,
    );
  }

  const config = MODE_CONFIG[mode];

  const modePrompt = config.prompt;

  const systemPrompt = `${BASE_SYSTEM_PROMPT}\n---\n${modePrompt}`;

  const payload = {
    includeCoverLetter,
    resume,
    jobDescription,
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

  const parsed = parseClaudeResponse(response);
  const data = validateTailorOutput(mode, parsed, resume, jobDescription);
  const usage = {
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
    cacheCreationTokens: response.usage.cache_creation_input_tokens ?? 0,
  };

  return {
    mode,
    data,
    usage,
  };
}
