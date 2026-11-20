import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("./services.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
});
const services = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

describe("resume text export", () => {
  it("preserves optional contact, education, and project details", () => {
    const text = services.formatResumeText({
      name: "Alex Rivera",
      title: "Software Engineer",
      email: "alex@example.com",
      phone: "555-0100",
      location: "Toronto",
      linkedin: "linkedin.com/in/alex",
      github: "github.com/alex",
      website: "alex.example.com",
      summary: "Software engineer.",
      skills: [],
      experience: [],
      education: [
        {
          institution: "Example University",
          degree: "BSc",
          field: "Computer Science",
          graduationDate: "2024",
          gpa: "3.8",
          honors: "Dean's List",
        },
      ],
      projects: [
        {
          name: "Resume App",
          description: "Built a resume editor.",
          technologies: ["TypeScript"],
          link: "resume.example.com",
        },
      ],
    });

    for (const detail of [
      "linkedin.com/in/alex",
      "github.com/alex",
      "alex.example.com",
      "GPA: 3.8",
      "Dean's List",
      "resume.example.com",
    ]) {
      assert.ok(text.includes(detail), `Expected export to include ${detail}`);
    }
  });
});
