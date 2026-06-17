// lib/tailor/modes.ts

import { ATS_SYSTEM_PROMPT } from "./ats";
import { BULLET_SYSTEM_PROMPT } from "./bullet";
import { COVER_LETTER_SYSTEM_PROMPT } from "./cover-letter";
import { FULL_SYSTEM_PROMPT } from "./full";
import { SUMMARY_SYSTEM_PROMPT } from "./summary";

export const TAILOR_MODES = {
  FULL_OPTIMIZER: "full_optimizer",
  ATS_ONLY: "ats_only",
  SUMMARY_ONLY: "summary_only",
  COVER_LETTER_ONLY: "cover_letter_only",
  BULLET_IMPROVER: "bullet_improver",
} as const;

export type TailorMode = (typeof TAILOR_MODES)[keyof typeof TAILOR_MODES];
export const MODE_CONFIG = {
  full_optimizer: {
    prompt: FULL_SYSTEM_PROMPT,
    maxTokens: 3000,
  },

  ats_only: {
    prompt: ATS_SYSTEM_PROMPT,
    maxTokens: 1500,
  },

  summary_only: {
    prompt: SUMMARY_SYSTEM_PROMPT,
    maxTokens: 1200,
  },

  bullet_improver: {
    prompt: BULLET_SYSTEM_PROMPT,
    maxTokens: 1200,
  },

  cover_letter_only: {
    prompt: COVER_LETTER_SYSTEM_PROMPT,
    maxTokens: 1800,
  },
} as const satisfies Record<
  TailorMode,
  {
    prompt: string;
    maxTokens: number;
  }
>;
