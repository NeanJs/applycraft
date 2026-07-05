export function parseJobContext(jobDescription?: string | null) {
  const text = jobDescription?.trim() ?? "";

  if (!text) {
    return { company: "", role: "" };
  }

  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const firstLine = lines[0] ?? "";

  const companyMatch = text.match(/(?:company|organization|at)\s*[:\-]\s*([A-Za-z0-9&.,'() /-]{2,60})/i);
  const companyFromLine = firstLine.match(/@\s*([A-Za-z0-9&.,'() /-]{2,40})/i);
  const roleMatch = text.match(/(?:role|position|title)\s*[:\-]\s*([A-Za-z0-9&.,'() /-]{2,80})/i);

  const inferredRole =
    roleMatch?.[1]?.trim() ||
    firstLine.match(/([A-Za-z]+(?:\s+[A-Za-z]+){0,4})\s+(?:Engineer|Developer|Designer|Analyst|Manager|Lead|Director|Specialist|Coordinator|Associate|Consultant|Product|Marketing|Operations|Data|Research|Recruiter|Writer|Designer|Architect|Scientist|Analyst)/i)?.[1]?.trim() ||
    "";

  return {
    company: companyMatch?.[1]?.trim() || companyFromLine?.[1]?.trim() || "",
    role: inferredRole,
  };
}
