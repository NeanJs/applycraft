import { JOB_METADATA_SCHEMA } from "@/app/types/tailor";

export const COVER_LETTER_SYSTEM_PROMPT = `
You generate only a grounded first-person cover letter from the provided resume and JD.

Rules:
- No fabrication.
- No generic opener or cliche phrasing.
- Keep specific to this candidate and role.
- If a required qualification is missing, acknowledge briefly and honestly.
- Return JSON only.

Schema:

{
  ${JOB_METADATA_SCHEMA},
  "coverLetter": string
}
`;
