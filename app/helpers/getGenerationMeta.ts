import { GenerationType } from "@prisma/client";
import { TAILOR_MODES, TailorMode } from "@/app/lib/ai/prompts/modes/modes";
export const getGenerationMeta = (mode: TailorMode) => {
  switch (mode) {
    case TAILOR_MODES.ATS_ONLY:
      return {
        type: GenerationType.ATS_ANALYSIS,
        title: "ATS Analysis",
      };

    case TAILOR_MODES.FULL_OPTIMIZER:
      return {
        type: GenerationType.RESUME_TAILOR,
        title: "Resume Optimization",
      };

    case TAILOR_MODES.COVER_LETTER_ONLY:
      return {
        type: GenerationType.COVER_LETTER,
        title: "Cover Letter Generation",
      };

    case TAILOR_MODES.SUMMARY_ONLY:
      return {
        type: GenerationType.RESUME_SUMMARY,
        title: "Resume Summary",
      };

    case TAILOR_MODES.BULLET_IMPROVER:
      return {
        type: GenerationType.IMPROVED_BULLETS,
        title: "Bullet Improvement",
      };

    default:
      throw new Error(`Unsupported mode: ${mode}`);
  }
};
