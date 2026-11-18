import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("./quality.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
});
const quality = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const { scoreResumeAgainstJob, validateTailorOutput } = quality;

const fixtures = JSON.parse(
  readFileSync(new URL("./quality-fixtures.json", import.meta.url), "utf8"),
);

describe("AI output quality checks", () => {
  for (const fixture of fixtures) {
    it(`classifies source evidence for ${fixture.candidateType}`, () => {
      const output = validateTailorOutput(
        "ats_only",
        {
          job: { jobTitle: "", companyName: "" },
          jobAnalysis: {
            requirements: [
              {
                requirement: fixture.requirement,
                category: fixture.category,
                importance: fixture.importance,
                applicability: fixture.applicability,
                supportingEvidence: fixture.supportingEvidence,
              },
            ],
          },
          insights: {
            topStrengths: [],
            biggestGaps: [],
            quickWins: [],
          },
        },
        fixture.resume,
        fixture.jobDescription,
      );

      assert.equal(
        output.jobAnalysis.requirements[0].status,
        fixture.expectedStatus,
      );
      assert.equal(
        output.atsScore,
        validateTailorOutput(
          "ats_only",
          {
            job: { jobTitle: "", companyName: "" },
            jobAnalysis: {
              requirements: [
                {
                  requirement: fixture.requirement,
                  category: fixture.category,
                  importance: fixture.importance,
                  applicability: fixture.applicability,
                  supportingEvidence: fixture.supportingEvidence,
                },
              ],
            },
            insights: {
              topStrengths: [],
              biggestGaps: [],
              quickWins: [],
            },
          },
          fixture.resume,
          fixture.jobDescription,
        ).atsScore,
      );
    });
  }

  it("weights required terms twice as much as preferred terms", () => {
    const requirement = (text, importance) => ({
      requirement: text,
      category: "technical_skill",
      importance,
      applicability: "applicable",
      supportingEvidence: "",
      status: "missing_evidence",
    });
    const analysis = scoreResumeAgainstJob("React", [
      { ...requirement("React", "required"), supportingEvidence: "React" },
      requirement("TypeScript", "preferred"),
    ]);

    assert.equal(analysis.breakdown.keywordMatch, 67);
  });

  it("clears evidence that is not quoted from the supplied resume", () => {
    const output = validateTailorOutput(
      "ats_only",
      {
        job: { jobTitle: "", companyName: "" },
        jobAnalysis: {
          requirements: [
            {
              requirement: "Python",
              category: "technical_skill",
              importance: "required",
              applicability: "applicable",
              supportingEvidence: "Led a Python team of 12",
            },
          ],
        },
        insights: {
          topStrengths: [],
          biggestGaps: [],
          quickWins: [],
        },
      },
      "Used Python.",
      "Required: Python experience.",
    );

    assert.equal(
      output.jobAnalysis.requirements[0].supportingEvidence,
      "",
    );
    assert.equal(
      output.jobAnalysis.requirements[0].status,
      "missing_evidence",
    );
  });

  it("omits requirements absent from the job description", () => {
    const output = validateTailorOutput(
      "ats_only",
      {
        job: { jobTitle: "", companyName: "" },
        jobAnalysis: {
          requirements: [
            {
              requirement: "Go",
              category: "technical_skill",
              importance: "required",
              applicability: "applicable",
              supportingEvidence: "Python",
            },
          ],
        },
        insights: {
          topStrengths: [],
          biggestGaps: [],
          quickWins: [],
        },
      },
      "Used Python.",
      "Required: Python experience.",
    );

    assert.deepEqual(output.jobAnalysis.requirements, []);
  });

  it("omits job metadata that is not supported by the job description", () => {
    const output = validateTailorOutput(
      "ats_only",
      {
        job: {
          jobTitle: "Invented Role",
          companyName: "Invented Company",
        },
        jobAnalysis: {
          requirements: [
            {
              requirement: "Python",
              category: "technical_skill",
              importance: "required",
              applicability: "applicable",
              supportingEvidence: "",
            },
          ],
        },
        insights: {
          topStrengths: [],
          biggestGaps: [],
          quickWins: [],
        },
      },
      "Used Python.",
      "Required: Python experience.",
    );

    assert.deepEqual(output.job, { jobTitle: "", companyName: "" });
  });

  it("uses explicit job title and company labels from the job description", () => {
    const output = validateTailorOutput(
      "ats_only",
      {
        job: { jobTitle: "", companyName: "" },
        jobAnalysis: {
          requirements: [
            {
              requirement: "Python",
              category: "technical_skill",
              importance: "required",
              applicability: "applicable",
              supportingEvidence: "",
            },
          ],
        },
        insights: {
          topStrengths: [],
          biggestGaps: [],
          quickWins: [],
        },
      },
      "Used Python.",
      "Job Title: Senior Web Developer\nCompany: Example Labs\nRequired: Python.",
    );

    assert.deepEqual(output.job, {
      jobTitle: "Senior Web Developer",
      companyName: "Example Labs",
    });
  });

  it("removes summary sentences containing unsupported numbers", () => {
    const output = validateTailorOutput(
      "summary_only",
      {
        summaries: {
          conservative: "Improved conversion by 45%. Experienced with React.",
          balanced: "Software professional.",
          impact: "Experienced with React.",
        },
      },
      "Software professional experienced with React.",
      "",
    );

    assert.equal(
      output.summaries.conservative,
      "Experienced with React.",
    );
  });

  it("omits unsupported structured resume details without rejecting the result", () => {
    const output = validateTailorOutput(
      "full_optimizer",
      {
        job: { jobTitle: "Engineer", companyName: "Example Corp" },
        jobType: "corporate",
        jobAnalysis: {
          requirements: [
            {
              requirement: "React",
              category: "technical_skill",
              importance: "required",
              applicability: "applicable",
              supportingEvidence: "",
            },
          ],
        },
        changesMade: [],
        coverLetter: "",
        optimizedResume: {
          name: "Invented Candidate",
          title: "",
          email: "",
          phone: "",
          location: "",
          summary: "",
          skills: [{ category: "Languages", items: ["React", "Invented Skill"] }],
          experience: [
            {
              company: "Invented Company",
              title: "",
              location: "",
              startDate: "",
              endDate: "",
              bullets: [],
            },
          ],
          education: [
            {
              institution: "Invented School",
              degree: "",
              field: "",
              graduationDate: "",
            },
          ],
          projects: [
            {
              name: "Invented Project",
              description: "",
              technologies: ["Invented Tool"],
            },
          ],
          certifications: ["Invented Certification"],
        },
      },
      "Candidate has React experience.",
      "Required: React. Role: Engineer at Example Corp.",
    );

    assert.equal(output.optimizedResume.name, "");
    assert.deepEqual(output.optimizedResume.skills[0].items, ["React"]);
    assert.equal(output.optimizedResume.experience[0].company, "");
    assert.equal(output.optimizedResume.education[0].institution, "");
    assert.equal(output.optimizedResume.projects[0].name, "");
    assert.deepEqual(output.optimizedResume.projects[0].technologies, []);
    assert.deepEqual(output.optimizedResume.certifications, []);
  });
});
