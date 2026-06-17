// types/tailor.ts

import { ResumeData, ATSBreakdown } from "./types";

export interface JobMetadata {
  jobTitle: string;
  companyName: string;
}
interface GenerationMetadata {
  saved: boolean;
}
export interface ATSOnlyBreakdown {
  structure: number;
  roleMatch: number;
  keywordMatch: number;
  readability: number;
}
export interface ATSResult {
  jobType: string;
  atsBefore: number;
  atsAfter: number;
  confidenceScore: number;
  atsBreakdown: ATSBreakdown;
  missingKeywords: string[];
}

export interface ATSOnlyResult extends GenerationMetadata {
  atsScore: number;

  keywordAnalysis: {
    matchedKeywords: string[];
    missingKeywords: string[];
    partialMatches: string[];
  };

  breakdown: ATSOnlyBreakdown;

  insights: {
    topStrengths: string[];
    biggestGaps: string[];
    quickWins: string[];
  };
  job: JobMetadata;

  mode: "ats_only";
}
export interface SummaryVersions {
  conservative: string;
  balanced: string;
  impact: string;
}

export interface SummaryResult extends GenerationMetadata {
  job: JobMetadata;
  summaries: SummaryVersions;
}

export interface CoverLetterResult extends GenerationMetadata {
  job: JobMetadata;
  coverLetter: string;
}

export interface ImprovedBullet {
  original: string;
  improved: string;
}

export interface ImprovedBulletsResult extends GenerationMetadata {
  bullets: ImprovedBullet[];
  job: JobMetadata;
}

export interface FullOptimizerResult extends GenerationMetadata {
  jobType: string;
  atsBefore: number;
  atsAfter: number;
  atsBreakdown: ATSBreakdown;
  confidenceScore: number;
  missingKeywords: string[];
  changesMade: string[];
  coverLetter: string;
  optimizedResume: ResumeData;
}

export type TailorResultMap = {
  full_optimizer: FullOptimizerResult;
  ats_only: ATSResult;
  summary_only: SummaryResult;
  cover_letter_only: CoverLetterResult;
  bullet_improver: ImprovedBulletsResult;
};
export const JOB_METADATA_SCHEMA = `
"job":{
  "jobTitle": string,
  "companyName": string
}
`;
