import type { TailorMode } from "./prompts/modes/modes";

export const MAX_RESUME_CHARS = 20_000;
export const MAX_JOB_DESCRIPTION_CHARS = 12_000;

export type RequirementCategory =
  | "technical_skill"
  | "soft_skill"
  | "responsibility"
  | "industry_terminology"
  | "seniority"
  | "education"
  | "experience";

export type RequirementImportance = "required" | "preferred";
export type RequirementStatus =
  | "strong_match"
  | "partial_match"
  | "missing_evidence"
  | "not_applicable";

export type JobRequirement = {
  requirement: string;
  category: RequirementCategory;
  importance: RequirementImportance;
  applicability: "applicable" | "not_applicable";
  supportingEvidence: string;
  status: RequirementStatus;
};

export type ATSBreakdown = {
  keywordMatch: number;
  structure: number;
  readability: number;
  roleMatch: number;
};

export class AIOutputValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIOutputValidationError";
  }
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "into",
  "is",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new AIOutputValidationError(`${label} must be an object.`);
  }
  return value;
}

function requireString(
  value: unknown,
  label: string,
  options: { allowEmpty?: boolean } = {},
): string {
  if (
    typeof value !== "string" ||
    (!options.allowEmpty && value.trim().length === 0)
  ) {
    throw new AIOutputValidationError(`${label} must be a non-empty string.`);
  }
  return value;
}

function requireStringArray(value: unknown, label: string): string[] {
  if (
    !Array.isArray(value) ||
    value.some((entry) => typeof entry !== "string")
  ) {
    throw new AIOutputValidationError(`${label} must be an array of strings.`);
  }
  return value;
}

function tokenize(value: string): string[] {
  return normalizeTechnicalTerms(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .match(/[a-z0-9]+/g)
    ?.filter((token) => !STOP_WORDS.has(token)) ?? [];
}

function normalizedPhrase(value: string): string {
  return (
    normalizeTechnicalTerms(value)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .match(/[a-z0-9]+/g)
      ?.join(" ") ?? ""
  );
}

function normalizeTechnicalTerms(value: string): string {
  return value
    .toLocaleLowerCase()
    .replace(/\bc\+\+(?![a-z0-9])/g, "cplusplus")
    .replace(/\bc#(?![a-z0-9])/g, "csharp")
    .replace(/\.net\b/g, "dotnet")
    .replace(/\b(node|react)\.?js\b/g, "$1js");
}

function phraseIsInSource(phrase: string, source: string): boolean {
  const normalized = normalizedPhrase(phrase);
  return normalized.length > 0 && ` ${normalizedPhrase(source)} `.includes(` ${normalized} `);
}

function tokenCoverage(requirement: string, resume: string): number {
  const tokens = [...new Set(tokenize(requirement))];
  if (!tokens.length) return 0;
  const resumeTokens = new Set(tokenize(resume));
  return tokens.filter((token) => resumeTokens.has(token)).length / tokens.length;
}

function validateRequirements(
  value: unknown,
  resume: string,
  jobDescription: string,
): JobRequirement[] {
  const analysis = requireRecord(value, "jobAnalysis");
  if (!Array.isArray(analysis.requirements)) {
    throw new AIOutputValidationError(
      "jobAnalysis.requirements must be an array.",
    );
  }

  const categories = new Set<RequirementCategory>([
    "technical_skill",
    "soft_skill",
    "responsibility",
    "industry_terminology",
    "seniority",
    "education",
    "experience",
  ]);
  const requirements: JobRequirement[] = [];
  const uniqueRequirements = new Set<string>();

  for (const rawRequirement of analysis.requirements.slice(0, 40)) {
    if (!isRecord(rawRequirement)) continue;
    const item = rawRequirement;
    if (typeof item.requirement !== "string") continue;
    const requirement = item.requirement.trim();
    const normalized = normalizedPhrase(requirement);
    if (
      !normalized ||
      requirement.length > 180 ||
      uniqueRequirements.has(normalized) ||
      !categories.has(item.category as RequirementCategory) ||
      (item.importance !== "required" && item.importance !== "preferred") ||
      (item.applicability !== "applicable" &&
        item.applicability !== "not_applicable") ||
      tokenCoverage(requirement, jobDescription) < 0.6
    ) {
      continue;
    }
    uniqueRequirements.add(normalized);

    const candidateEvidence =
      typeof item.supportingEvidence === "string"
        ? item.supportingEvidence.trim()
        : "";
    const supportingEvidence =
      candidateEvidence.length <= 1_000 &&
      phraseIsInSource(candidateEvidence, resume)
        ? candidateEvidence
        : "";

    let status: RequirementStatus;
    if (item.applicability === "not_applicable") {
      status = "not_applicable";
    } else if (!supportingEvidence) {
      status = "missing_evidence";
    } else {
      const coverage = tokenCoverage(requirement, supportingEvidence);
      status =
        coverage >= 0.75
          ? "strong_match"
          : "partial_match";
    }

    requirements.push({
      requirement,
      category: item.category as RequirementCategory,
      importance: item.importance,
      applicability: item.applicability,
      supportingEvidence,
      status,
    });
  }
  return requirements;
}

function weightedCoverage(requirements: JobRequirement[]): number {
  const applicable = requirements.filter(
    (requirement) => requirement.status !== "not_applicable",
  );
  const totalWeight = applicable.reduce(
    (total, requirement) =>
      total + (requirement.importance === "required" ? 2 : 1),
    0,
  );
  if (!totalWeight) return 0;

  const matchedWeight = applicable.reduce((total, requirement) => {
    const match =
      requirement.status === "strong_match"
        ? 1
        : requirement.status === "partial_match"
          ? 0.5
          : 0;
    return (
      total +
      match * (requirement.importance === "required" ? 2 : 1)
    );
  }, 0);

  return Math.round((matchedWeight / totalWeight) * 100);
}

function scoreStructure(resume: string): number {
  const checks = [
    /\b(summary|profile|objective)\b/i.test(resume),
    /\b(experience|employment|work history)\b/i.test(resume),
    /\b(education|academic)\b/i.test(resume),
    /\b(skills|technical skills|competencies)\b/i.test(resume),
    /\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/i.test(resume) ||
      /\b(?:\+?\d[\d(). -]{7,}\d)\b/.test(resume),
  ];
  return Math.round(
    (checks.filter(Boolean).length / checks.length) * 100,
  );
}

function scoreReadability(resume: string): number {
  const bullets = resume
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*•]\s+/.test(line));
  if (!bullets.length) return 0;

  const readable = bullets.filter((line) => {
    const words = line.split(/\s+/).length - 1;
    return words >= 5 && words <= 35 && line.length <= 240;
  }).length;
  return Math.round((readable / bullets.length) * 100);
}

function scoreRoleMatch(requirements: JobRequirement[]): number {
  const roleRequirements = requirements.filter((requirement) =>
    ["responsibility", "experience", "seniority"].includes(requirement.category),
  );
  return weightedCoverage(roleRequirements.length ? roleRequirements : requirements);
}

function resumeDataToText(resume: Record<string, unknown>): string {
  const skills = Array.isArray(resume.skills)
    ? resume.skills
        .filter(isRecord)
        .flatMap((skill) =>
          Array.isArray(skill.items)
            ? skill.items.filter((item): item is string => typeof item === "string")
            : [],
        )
        .join(", ")
    : "";
  const experience = Array.isArray(resume.experience)
    ? resume.experience
        .filter(isRecord)
        .map((job) =>
          [
            job.title,
            job.company,
            job.location,
            job.startDate,
            job.endDate,
          ]
            .filter((item): item is string => typeof item === "string")
            .join(" ") +
          (Array.isArray(job.bullets)
            ? `\n${job.bullets
                .filter((bullet): bullet is string => typeof bullet === "string")
                .map((bullet) => `- ${bullet}`)
                .join("\n")}`
            : ""),
        )
        .join("\n")
    : "";
  const education = Array.isArray(resume.education)
    ? resume.education
        .filter(isRecord)
        .map((item) => Object.values(item).filter((value): value is string => typeof value === "string").join(" "))
        .join("\n")
    : "";
  const projects = Array.isArray(resume.projects)
    ? resume.projects
        .filter(isRecord)
        .map((item) =>
          Object.values(item)
            .flatMap((value) => (Array.isArray(value) ? value : [value]))
            .filter((value): value is string => typeof value === "string")
            .join(" "),
        )
        .join("\n")
    : "";
  const certifications = Array.isArray(resume.certifications)
    ? resume.certifications.filter((item): item is string => typeof item === "string").join("\n")
    : "";

  return [
    `CONTACT\n${[
      resume.name,
      resume.title,
      resume.email,
      resume.phone,
      resume.location,
    ]
      .filter((item): item is string => typeof item === "string")
      .join(" ")}`,
    `SUMMARY\n${typeof resume.summary === "string" ? resume.summary : ""}`,
    `SKILLS\n${skills}`,
    `EXPERIENCE\n${experience}`,
    `EDUCATION\n${education}`,
    `PROJECTS\n${projects}`,
    `CERTIFICATIONS\n${certifications}`,
  ].join("\n");
}

export function scoreResumeAgainstJob(
  resume: string,
  requirements: JobRequirement[],
  structuredResumeText = resume,
  useEvidenceStatus = false,
) {
  const scoredRequirements = requirements.map((requirement) => {
    const coverage = tokenCoverage(requirement.requirement, resume);
    const status: RequirementStatus =
      useEvidenceStatus
        ? requirement.status
        : requirement.applicability === "not_applicable"
        ? "not_applicable"
        : coverage >= 0.75
          ? "strong_match"
          : coverage > 0
            ? "partial_match"
            : "missing_evidence";

    return { ...requirement, status };
  });
  const breakdown: ATSBreakdown = {
    keywordMatch: weightedCoverage(scoredRequirements),
    structure: scoreStructure(structuredResumeText),
    readability: scoreReadability(structuredResumeText),
    roleMatch: scoreRoleMatch(scoredRequirements),
  };
  const score = Math.round(
    breakdown.keywordMatch * 0.4 +
      breakdown.roleMatch * 0.3 +
      breakdown.structure * 0.15 +
      breakdown.readability * 0.15,
  );

  return { score, breakdown, requirements: scoredRequirements };
}

function validateResumeData(value: unknown): Record<string, unknown> {
  const resume = requireRecord(value, "optimizedResume");
  for (const key of ["name", "title", "email", "phone", "location", "summary"]) {
    requireString(resume[key], `optimizedResume.${key}`, { allowEmpty: true });
  }
  if (
    !Array.isArray(resume.skills) ||
    !Array.isArray(resume.experience) ||
    !Array.isArray(resume.education) ||
    resume.skills.length > 30 ||
    resume.experience.length > 40 ||
    resume.education.length > 20
  ) {
    throw new AIOutputValidationError(
      "optimizedResume.skills, experience, and education must be arrays.",
    );
  }
  for (const [index, skill] of resume.skills.entries()) {
    const item = requireRecord(skill, `optimizedResume.skills[${index}]`);
    requireString(item.category, `optimizedResume.skills[${index}].category`);
    requireStringArray(item.items, `optimizedResume.skills[${index}].items`);
  }
  for (const [index, experience] of resume.experience.entries()) {
    const item = requireRecord(experience, `optimizedResume.experience[${index}]`);
    for (const key of ["company", "title", "location", "startDate", "endDate"]) {
      requireString(item[key], `optimizedResume.experience[${index}].${key}`, {
        allowEmpty: true,
      });
    }
    requireStringArray(item.bullets, `optimizedResume.experience[${index}].bullets`);
    if ((item.bullets as string[]).length > 4) {
      throw new AIOutputValidationError(
        `optimizedResume.experience[${index}] has more than four bullets.`,
      );
    }
  }
  for (const [index, education] of resume.education.entries()) {
    const item = requireRecord(education, `optimizedResume.education[${index}]`);
    for (const key of ["institution", "degree", "field", "graduationDate"]) {
      requireString(item[key], `optimizedResume.education[${index}].${key}`, {
        allowEmpty: true,
      });
    }
  }
  if (resume.projects !== undefined) {
    if (!Array.isArray(resume.projects) || resume.projects.length > 30) {
      throw new AIOutputValidationError("optimizedResume.projects must be an array.");
    }
    for (const [index, project] of resume.projects.entries()) {
      const item = requireRecord(project, `optimizedResume.projects[${index}]`);
      requireString(item.name, `optimizedResume.projects[${index}].name`, {
        allowEmpty: true,
      });
      requireString(item.description, `optimizedResume.projects[${index}].description`, {
        allowEmpty: true,
      });
      requireStringArray(
        item.technologies,
        `optimizedResume.projects[${index}].technologies`,
      );
      if (item.link !== undefined) {
        requireString(item.link, `optimizedResume.projects[${index}].link`, {
          allowEmpty: true,
        });
      }
    }
  }
  for (const [index, education] of resume.education.entries()) {
    const item = education as Record<string, unknown>;
    for (const key of ["gpa", "honors"]) {
      if (item[key] !== undefined) {
        requireString(item[key], `optimizedResume.education[${index}].${key}`, {
          allowEmpty: true,
        });
      }
    }
  }
  for (const key of ["linkedin", "github", "website"]) {
    if (resume[key] !== undefined) {
      requireString(resume[key], `optimizedResume.${key}`, { allowEmpty: true });
    }
  }
  if (resume.certifications !== undefined) {
    requireStringArray(resume.certifications, "optimizedResume.certifications");
  }
  return resume;
}

function validateSourceBackedResumeFields(
  optimizedResume: Record<string, unknown>,
  sourceResume: string,
): void {
  const sourceBackedString = (value: unknown): string => {
    if (typeof value !== "string" || !value.trim()) return "";
    return phraseIsInSource(value, sourceResume) ? value.trim() : "";
  };
  const sourceBackedStrings = (values: unknown): string[] =>
    Array.isArray(values)
      ? values.map(sourceBackedString).filter((value) => value.length > 0)
      : [];

  for (const key of [
    "name",
    "title",
    "email",
    "phone",
    "location",
    "linkedin",
    "github",
    "website",
  ]) {
    optimizedResume[key] = sourceBackedString(optimizedResume[key]);
  }

  for (const skill of optimizedResume.skills as Record<string, unknown>[]) {
    skill.items = sourceBackedStrings(skill.items);
  }
  for (const experience of optimizedResume.experience as Record<string, unknown>[]) {
    for (const key of [
      "company",
      "title",
      "location",
      "startDate",
      "endDate",
    ]) {
      experience[key] = sourceBackedString(experience[key]);
    }
  }
  for (const education of optimizedResume.education as Record<string, unknown>[]) {
    for (const key of ["institution", "degree", "field", "graduationDate", "gpa", "honors"]) {
      if (key in education) education[key] = sourceBackedString(education[key]);
    }
  }
  for (const project of (optimizedResume.projects ?? []) as Record<string, unknown>[]) {
    project.name = sourceBackedString(project.name);
    project.technologies = sourceBackedStrings(project.technologies);
  }
  if (Array.isArray(optimizedResume.certifications)) {
    optimizedResume.certifications = sourceBackedStrings(
      optimizedResume.certifications,
    );
  }
}

function validateJobAnalysis(
  result: Record<string, unknown>,
  resume: string,
  jobDescription: string,
): JobRequirement[] {
  return validateRequirements(result.jobAnalysis, resume, jobDescription);
}

function sanitizeUnsupportedNumbers(value: unknown, resume: string): unknown {
  const sourceNumbers = new Set(
    (resume.match(/\d[\d,.]*(?:%|\+)?/g) ?? []).map((value) =>
      value.replace(/[,.]/g, ""),
    ),
  );
  const isSupported = (text: string) =>
    (text.match(/\d[\d,.]*(?:%|\+)?/g) ?? []).every((number) =>
      sourceNumbers.has(number.replace(/[,.]/g, "")),
    );

  if (typeof value === "string") {
    return value
      .split(/(?<=[.!?])\s+|\n+/)
      .filter(isSupported)
      .join(" ")
      .trim();
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeUnsupportedNumbers(item, resume))
      .filter((item) => typeof item !== "string" || item.length > 0);
  }
  if (isRecord(value)) {
    for (const [key, item] of Object.entries(value)) {
      if (!["jobAnalysis", "atsBreakdown", "breakdown"].includes(key)) {
        value[key] = sanitizeUnsupportedNumbers(item, resume);
      }
    }
  }
  return value;
}

function validateInsights(value: unknown) {
  const insights = requireRecord(value, "insights");
  for (const key of ["topStrengths", "biggestGaps", "quickWins"]) {
    requireStringArray(insights[key], `insights.${key}`);
  }
  return insights;
}

function validateJobMetadata(
  result: Record<string, unknown>,
  jobDescription: string,
  required = false,
): void {
  if (result.job === undefined) {
    if (required) {
      throw new AIOutputValidationError("job metadata is required.");
    }
    return;
  }
  const job = requireRecord(result.job, "job");
  requireString(job.jobTitle, "job.jobTitle", { allowEmpty: true });
  requireString(job.companyName, "job.companyName", { allowEmpty: true });
  const labeledJobTitle = extractLabeledJobValue(
    jobDescription,
    /(?:job\s+title|position(?:\s+title)?|role)\s*[:\-]\s*([^\r\n|]+)/i,
  );
  const labeledCompanyName = extractLabeledJobValue(
    jobDescription,
    /(?:company|organization|employer)\s*[:\-]\s*([^\r\n|]+)/i,
  );
  for (const [key, fallback] of [
    ["jobTitle", labeledJobTitle],
    ["companyName", labeledCompanyName],
  ] as const) {
    const value = job[key] as string;
    job[key] = value.trim() && phraseIsInSource(value, jobDescription)
      ? value.trim()
      : fallback;
  }
}

function extractLabeledJobValue(
  jobDescription: string,
  pattern: RegExp,
): string {
  return jobDescription.match(pattern)?.[1]?.trim() ?? "";
}

function validateAllowedKeys(
  result: Record<string, unknown>,
  allowedKeys: string[],
): void {
  const unexpected = Object.keys(result).filter((key) => !allowedKeys.includes(key));
  if (unexpected.length) {
    throw new AIOutputValidationError(
      `Unexpected model output fields: ${unexpected.join(", ")}.`,
    );
  }
}

export function validateTailorOutput(
  mode: TailorMode,
  value: unknown,
  resume: string,
  jobDescription: string,
): Record<string, unknown> {
  const result = requireRecord(value, "Model output");

  if (mode === "full_optimizer") {
    validateAllowedKeys(result, [
      "job",
      "jobType",
      "jobAnalysis",
      "changesMade",
      "coverLetter",
      "optimizedResume",
      "atsBefore",
      "atsAfter",
      "atsBreakdown",
      "missingKeywords",
      "confidenceScore",
    ]);
    validateJobMetadata(result, jobDescription, true);
    const optimizedResume = validateResumeData(result.optimizedResume);
    validateSourceBackedResumeFields(optimizedResume, resume);
    if (!["corporate", "startup", "leadership"].includes(String(result.jobType))) {
      throw new AIOutputValidationError("jobType is invalid.");
    }
    requireStringArray(result.changesMade, "changesMade");
    requireString(result.coverLetter, "coverLetter", { allowEmpty: true });

    result.coverLetter = sanitizeUnsupportedNumbers(result.coverLetter, resume);
    result.changesMade = sanitizeUnsupportedNumbers(result.changesMade, resume);
    sanitizeUnsupportedNumbers(optimizedResume, resume);
    const requirements = validateJobAnalysis(result, resume, jobDescription);
    const before = scoreResumeAgainstJob(resume, requirements);
    const optimizedResumeText = resumeDataToText(optimizedResume);
    const after = scoreResumeAgainstJob(optimizedResumeText, requirements);

    result.jobAnalysis = { requirements: after.requirements };
    result.atsBefore = before.score;
    result.atsAfter = after.score;
    result.atsBreakdown = after.breakdown;
    result.missingKeywords = after.requirements
      .filter((requirement) => requirement.status === "missing_evidence")
      .map((requirement) => requirement.requirement);
    delete result.confidenceScore;
  } else if (mode === "ats_only") {
    validateAllowedKeys(result, [
      "job",
      "jobAnalysis",
      "insights",
      "atsScore",
      "keywordAnalysis",
      "breakdown",
    ]);
    validateJobMetadata(result, jobDescription, true);
    const requirements = validateJobAnalysis(result, resume, jobDescription);
    const assessment = scoreResumeAgainstJob(
      resume,
      requirements,
      resume,
      true,
    );
    result.insights = sanitizeUnsupportedNumbers(
      validateInsights(result.insights),
      resume,
    );
    result.jobAnalysis = { requirements: assessment.requirements };
    result.keywordAnalysis = {
      matchedKeywords: assessment.requirements
        .filter((requirement) => requirement.status === "strong_match")
        .map((requirement) => requirement.requirement),
      partialMatches: assessment.requirements
        .filter((requirement) => requirement.status === "partial_match")
        .map((requirement) => requirement.requirement),
      missingKeywords: assessment.requirements
        .filter((requirement) => requirement.status === "missing_evidence")
        .map((requirement) => requirement.requirement),
    };
    result.atsScore = assessment.score;
    result.breakdown = assessment.breakdown;
  } else if (mode === "summary_only") {
    validateAllowedKeys(result, ["summaries"]);
    const summaries = requireRecord(result.summaries, "summaries");
    for (const key of ["conservative", "balanced", "impact"]) {
      requireString(summaries[key], `summaries.${key}`);
    }
    result.summaries = sanitizeUnsupportedNumbers(summaries, resume);
  } else if (mode === "bullet_improver") {
    validateAllowedKeys(result, ["job", "experiences"]);
    validateJobMetadata(result, jobDescription, true);
    if (!Array.isArray(result.experiences)) {
      throw new AIOutputValidationError("experiences must be an array.");
    }
    for (const [index, experience] of result.experiences.entries()) {
      const item = requireRecord(experience, `experiences[${index}]`);
      requireString(item.company, `experiences[${index}].company`, {
        allowEmpty: true,
      });
      requireString(item.role, `experiences[${index}].role`, { allowEmpty: true });
      requireStringArray(item.improvedBullets, `experiences[${index}].improvedBullets`);
    }
    result.experiences = sanitizeUnsupportedNumbers(result.experiences, resume);
  } else {
    validateAllowedKeys(result, ["job", "coverLetter"]);
    validateJobMetadata(result, jobDescription, true);
    requireString(result.coverLetter, "coverLetter");
    result.coverLetter = sanitizeUnsupportedNumbers(result.coverLetter, resume);
  }

  return result;
}
