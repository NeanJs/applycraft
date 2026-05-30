import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const { resume, jobDescription } = await req.json();

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2500,

    messages: [
      {
        role: "user",
        content: `
You are an expert ATS resume optimization engine.

STEP 1: Analyze the job description and classify it into ONE category:
- Execution-focused corporate role
- Startup / ownership role
- Technical leadership role

STEP 2: Tailor the resume based on the classification:
- Preserve factual accuracy at all times.
- Do NOT invent new experience, companies, or achievements.
- You may rephrase and reframe existing experience ONLY.

RULES:
- Do not add any information that is not explicitly present in the resume.
- Do not exaggerate impact or metrics.
- Maintain professional tone aligned with the job type.
- Preserve leadership signals ONLY if relevant to job type.

OUTPUT FORMAT RULES:
- Do NOT include explanations.
- Do NOT include markdown.
- Return ONLY valid JSON.

Return exactly this schema:

{
  "jobType": "Execution-focused corporate role | Startup / ownership role | Technical leadership role",
  "atsScore": number (0-100),
  "optimizedResume": string,
  "missingKeywords": string[],
  "coverLetter": string
}

INPUT:

Resume:
${resume}

Job Description:
${jobDescription}
  
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
      error: "Invalid JSON from model",
      raw: text,
    });
  }

  return Response.json(parsed);
}
