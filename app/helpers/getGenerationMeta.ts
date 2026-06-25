import { GenerationType } from "@prisma/client";
import { TAILOR_MODES, TailorMode } from "@/app/lib/ai/prompts/modes/modes";
import { JobMetadata } from "../types/tailor";

function buildTitle(fallback: string, job?: JobMetadata) {
  if (job?.jobTitle && job?.companyName) {
    return `${job.jobTitle}, ${job.companyName}`;
  }
  if (job?.jobTitle) {
    return `${job.jobTitle} Resume`;
  }
  return fallback;
}

export const getGenerationMeta = (mode: TailorMode, job?: JobMetadata) => {
  switch (mode) {
    case TAILOR_MODES.ATS_ONLY:
      return {
        type: GenerationType.ATS_ANALYSIS,
        title: buildTitle("ATS Analysis", job),
      };

    case TAILOR_MODES.FULL_OPTIMIZER:
      return {
        type: GenerationType.RESUME_TAILOR,
        title: buildTitle("Resume Optimization", job),
      };

    case TAILOR_MODES.COVER_LETTER_ONLY:
      return {
        type: GenerationType.COVER_LETTER,
        title: buildTitle("Cover Letter Generation", job),
      };

    case TAILOR_MODES.SUMMARY_ONLY:
      return {
        type: GenerationType.RESUME_SUMMARY,
        title: buildTitle("Resume Summary", job),
      };

    case TAILOR_MODES.BULLET_IMPROVER:
      return {
        type: GenerationType.IMPROVED_BULLETS,
        title: buildTitle("Bullet Improvement", job),
      };

    default:
      throw new Error(`Unsupported mode: ${mode}`);
  }
};
