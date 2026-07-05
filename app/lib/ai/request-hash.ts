import { createHash } from "node:crypto";

export function buildRequestHash(input: {
  mode: string;
  resume: string;
  jobDescription: string;
  includeCoverLetter: boolean;
  promptVersion: string;
}) {
  const normalized = JSON.stringify({
    mode: input.mode,
    includeCoverLetter: input.includeCoverLetter,
    promptVersion: input.promptVersion,
    resume: input.resume,
    jobDescription: input.jobDescription,
  });

  return createHash("sha256").update(normalized).digest("hex");
}
