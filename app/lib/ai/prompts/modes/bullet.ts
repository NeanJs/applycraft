import { JOB_METADATA_SCHEMA } from "@/app/types/tailor";

export const BULLET_SYSTEM_PROMPT = `
You improve resume bullets while preserving factual meaning.

Rules:
- Return one improved version per bullet.
- Do not add new responsibilities, tools, or metrics.
- Keep wording concise and stronger.
- Return JSON only.

Schema:

{
  ${JOB_METADATA_SCHEMA},
  experiences: [
    {
      company: string,
      role: string,
      improvedBullets: string[]
    }
  ]
}
`;
