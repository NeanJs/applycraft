import Anthropic from "@anthropic-ai/sdk";
import { syncUser } from "@/app/lib/sync-user";
import { prisma } from "@/app/lib/prisma";
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const { resume, jobDescription } = await req.json();

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 3000,

    messages: [
      {
        role: "user",
        content: `
You are an expert ATS resume optimization engine.

STEP 1: Analyze the job description and classify it into ONE category:
- Execution-focused corporate role
- Startup / ownership role
- Technical leadership role

STEP 2: Optimize the resume based on the classification:
- Preserve factual accuracy at all times.
- Do NOT invent new experience, companies, or achievements.
- You may rephrase and reframe existing experience ONLY.
- Improve keyword alignment for ATS scoring without adding false information.
- Strengthen clarity, impact, and relevance to the job type.
- Omit any fields that are empty or not present in the original resume (github, website, linkedin, gpa, honors, projects, certifications). Do not return null or empty strings — just leave the key out entirely.
STEP 3: Generate a tailored cover letter:
- Must be highly specific to the job description.
- Must reference real experience ONLY from the resume.
- Avoid generic phrases like "I am excited to apply" unless contextually justified.
- Must include:
  - 1 opening hook tied to role/company type
  - 1–2 paragraphs mapping experience to role requirements
  - 1 closing paragraph with intent and value
- Tone must match jobType:
  - Corporate: structured, formal, precise
  - Startup: energetic, ownership-driven
  - Leadership: strategic, high-level, impact-focused

RULES:
- Do NOT add any information that is not explicitly present in the resume.
- Do NOT exaggerate impact or metrics.
- Maintain professional tone aligned with job type.
- Preserve leadership signals ONLY if relevant to job type.

OUTPUT FORMAT RULES:
- Do NOT include explanations.
- Do NOT include markdown.
- Return ONLY valid JSON.

Return exactly this schema:

{
  "jobType": "Execution-focused corporate role | Startup / ownership role | Technical leadership role",
  "atsScore": number (0-100),
  "optimizedResume": ResumeData,
  "missingKeywords": string[],
  "coverLetter": string
}

ResumeData schema must follow this structure exactly:

{
  "name": string,
  "title": string,
  "email": string,
  "phone": string,
  "location": string,
  "linkedin": string,
  "github": string,
  "website": string,
  "summary": string,
  "skills": [
    {
      "category": string,
      "items": string[]
    }
  ],
  "experience": [
    {
      "company": string,
      "title": string,
      "location": string,
      "startDate": string,
      "endDate": string,
      "bullets": string[]
    }
  ],
  "education": [
    {
      "institution": string,
      "degree": string,
      "field": string,
      "graduationDate": string,
      "gpa": string,
      "honors": string
    }
  ],
  "projects": [
    {
      "name": string,
      "description": string,
      "technologies": string[],
      "link": string
    }
  ],
  "certifications": string[]
}

- Prioritize ATS keyword alignment ONLY from provided job description (no hallucinated skills).

INPUT:

Resume:
${resume.slice(0, 3000)}

Job Description:
${jobDescription.slice(0, 1500)}
`,
      },
    ],
  });
  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  // strip markdown code fences
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  let parsed;

  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    return Response.json({
      error: "Invalid JSON from model" + err,
      raw: text,
    });
  }

  const user = await syncUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const savedResume = await prisma.resume.create({
    data: {
      userId: user.id,

      title:
        parsed.optimizedResume.title ||
        parsed.optimizedResume.name ||
        "Untitled Resume",

      data: parsed.optimizedResume,

      coverLetter: parsed.coverLetter,
      missingKeywords: parsed.missingKeywords,
      jobDescription,
    },
  });

  return Response.json({
    ...parsed,
    resumeId: savedResume.id,
  });
}
