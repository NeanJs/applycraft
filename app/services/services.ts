import { ResumeData } from "../types/types";

export const formatResumeText = (data: ResumeData): string => {
  const sections: string[] = [];

  const contactDetails = [
    data.email,
    data.phone,
    data.location,
    data.linkedin ? `LinkedIn: ${data.linkedin}` : "",
    data.github ? `GitHub: ${data.github}` : "",
    data.website ? `Website: ${data.website}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  sections.push(`${data.name}
${data.title}
${contactDetails}`);

  if (data.summary) {
    sections.push(`SUMMARY\n${data.summary}`);
  }

  if (data.skills?.length) {
    sections.push(
      `SKILLS\n${data.skills.map((s) => `${s.category}: ${s.items.join(", ")}`).join("\n")}`,
    );
  }

  if (data.experience?.length) {
    sections.push(
      `EXPERIENCE\n${data.experience
        .map(
          (exp) =>
            `${exp.title} @ ${exp.company}
${exp.location} | ${exp.startDate} - ${exp.endDate}
${exp.bullets.map((b) => `- ${b}`).join("\n")}`,
        )
        .join("\n\n")}`,
    );
  }

  if (data.projects?.length) {
    sections.push(
      `PROJECTS\n${data.projects
        .map(
          (p) =>
            `${p.name}: ${p.description} (${p.technologies.join(", ")})${p.link ? ` - ${p.link}` : ""}`,
        )
        .join("\n")}`,
    );
  }

  if (data.education?.length) {
    sections.push(
      `EDUCATION\n${data.education
        .map(
          (e) => {
            const details = [
              e.honors,
              e.gpa ? `GPA: ${e.gpa}` : "",
            ]
              .filter(Boolean)
              .join(" | ");

            return `${e.degree} in ${e.field} - ${e.institution} (${e.graduationDate})${details ? ` | ${details}` : ""}`;
          },
        )
        .join("\n")}`,
    );
  }

  if (data.certifications?.length) {
    sections.push(`CERTIFICATIONS\n${data.certifications.join("\n")}`);
  }

  return sections.join("\n\n");
};
const handleDownload = (optimizedResume: ResumeData) => {
  const text = formatResumeText(optimizedResume);
  const blob = new Blob([text], {
    type: "text/plain",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "Optimzed Resume.txt";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// NEW METHOD
const handlePDFExport = async (resumeId: string, name: string) => {
  const res = await fetch("/api/export-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeId }),
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}` + ".pdf";
  a.click();
  URL.revokeObjectURL(url);
};

export { handleDownload, handlePDFExport };
