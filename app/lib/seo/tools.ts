// tools.ts
// Full toolSEO config, metadata (used by generateToolMetadata) plus
// SEO content (intro/sections/faqs) consumed by <ToolSeoContent />.

export const toolSEO = {
  "job-tracker": {
    title: "Job Application Tracker, Free Pipeline Board | ApplyCraft",
    description:
      "Track every job application in one pipeline. Organize status, company, role, and submitted resume version so you never lose context.",
    keywords: [
      "job application tracker",
      "job tracker",
      "application tracking board",
      "job search organizer",
      "track job applications",
    ],

    intro:
      "When applications live across notes, spreadsheets, and inbox threads, follow-ups slip and interviews get missed. ApplyCraft Job Tracker gives you one pipeline from Saved to Offer with each company, role, and resume version attached so your job search stays organized and measurable.",

    sections: [
      {
        heading: "Why a job tracker matters",
        body: "A job search creates dozens of moving pieces: versions of your resume, interview stages, recruiter replies, and deadlines. A tracker centralizes this into one view so you can prioritize follow-ups, avoid duplicate applications, and maintain momentum week to week.",
      },
      {
        heading: "What you can track",
        body: "For each application, store the company, role title, current status, and notes, plus the exact tailored resume you sent. This makes it easier to prepare for interviews because you can quickly reopen what the recruiter actually saw.",
      },
      {
        heading: "How it fits with resume tailoring",
        body: "Use ApplyCraft to optimize a resume for a job, then immediately save that version into your tracker workflow. Instead of disconnected tools, you get one loop: optimize, apply, track, and follow up from the same system.",
      },
    ],

    faqs: [
      {
        question: "Is the job tracker free to use?",
        answer:
          "Yes. You can start using the tracker with a free account and organize your application pipeline right away.",
      },
      {
        question: "Can I attach the resume version I submitted?",
        answer:
          "Yes. The tracker is designed so each application can be tied to the tailored resume you actually sent for that role.",
      },
      {
        question: "What statuses can I use?",
        answer:
          "You can track applications across stages like Saved, Applied, Interview, Offer, and Rejected, then update as your process moves forward.",
      },
      {
        question: "How is this different from a spreadsheet?",
        answer:
          "A spreadsheet can list applications, but ApplyCraft keeps your resume optimization workflow and application tracking connected, so context is preserved end-to-end.",
      },
      {
        question: "Can I use this with the resume tailor tool?",
        answer:
          "Yes. After tailoring a resume for a role, you can store and manage that application in the Job Tracker pipeline for follow-up and interview prep.",
      },
    ],
  },

  "resume-tailor": {
    title: "Tailor your resume to any job, free | ApplyCraft",
    description:
      "Compare a resume with a job description, review evidence-backed requirements and gaps, and create a tailored draft with a transparent match estimate.",
    keywords: [
      "resume optimizer",
      "ATS resume checker",
      "AI resume writer",
      "cover letter generator",
      "job application tool",
    ],

    intro:
      "ApplyCraft compares the resume and job description you provide, identifies role requirements, and drafts clearer, role-relevant wording from the supplied experience. Its match estimate uses a documented heuristic; it is not a vendor-specific ATS score and cannot predict screening or hiring outcomes.",

    sections: [
      {
        heading: "How tailoring can help",
        body: "Job descriptions use role-specific language, but applicant tracking systems differ and employers configure them differently. Reviewing how your documented experience relates to a particular posting can help you decide what to emphasize. Never add a skill or qualification simply because it appears in the posting.",
      },
      {
        heading: "What gets rewritten",
        body: "The tool extracts required and preferred terms, checks for supporting resume evidence, and drafts concise wording that reflects relevant experience. The estimate checks selected section headings and bullet length; it does not inspect every document-layout or vendor-specific parsing rule. Review all generated details against your original before use.",
      },
      {
        heading: "Review before applying",
        body: "Paste resume text or upload a PDF, then compare the generated draft with your source. The estimate is based on requirements extracted from the posting and a fixed rubric; it is not an ATS result or a promise of an interview.",
      },
    ],

    faqs: [
      {
        question: "Does resume tailoring mean lying on my resume?",
        answer:
          "Tailoring should clarify and prioritize documented experience, not add qualifications. ApplyCraft prompts and checks outputs against the supplied resume, but automated checks cannot prove every statement's meaning. Review each claim and correct or remove anything that is not accurate.",
      },
      {
        question: "How is this different from a generic resume builder?",
        answer:
          "It compares the supplied resume with a specific job description and suggests evidence-grounded wording and requirement coverage. The result is a draft for your review, not an automatically verified resume.",
      },
      {
        question: "Will a tailored resume actually pass an ATS?",
        answer:
          "There is no guarantee. Applicant tracking systems and employer configurations vary. ApplyCraft provides a transparent estimate from extracted requirements, resume evidence, section presence, and bullet length; it does not reproduce or predict any named ATS decision.",
      },
      {
        question: "Do I need to create an account to try it?",
        answer:
          "No, your first resume optimization is free with no account or card required. Creating a free account lets you save results and run additional optimizations.",
      },
      {
        question: "What file formats can I upload?",
        answer:
          "You can paste your resume as plain text or upload it as a PDF. Paste the job description text from the source where you found it.",
      },
    ],
  },

  "ats-resume-checker": {
    title: "Free ATS Resume Checker, Scan Your Resume | ApplyCraft",
    description:
      "Get a transparent resume-to-job match estimate, requirement coverage, and evidence-based gaps. The estimate is not a score from a specific ATS.",
    keywords: [
      "ATS resume checker",
      "ATS score",
      "resume scanner",
      "applicant tracking system checker",
      "free ATS check",
    ],

    intro:
      "Applicant tracking systems differ in how they parse and rank applications, and their scoring methods are not publicly consistent. ApplyCraft compares resume text with a job description using a fixed heuristic and shows the extracted requirements, evidence, and gaps. It cannot predict how a particular employer's system will process an application.",

    sections: [
      {
        heading: "What this estimate checks",
        body: "The estimate uses requirements extracted from the job description, resume evidence, the presence of contact details and common section headings, and a simple bullet-length check. It is a transparent heuristic over text, not an inspection of every layout feature or the rules used by a particular ATS.",
      },
      {
        heading: "How to use the result",
        body: "Review each required or preferred item and its resume evidence. Missing evidence is a prompt to reflect on your experience or provide a verified clarification, not a suggestion to add an unsupported skill. The estimate is not a qualification judgment or hiring prediction.",
      },
      {
        heading: "Limits of text-based checks",
        body: "PDF text extraction can lose layout details, and this tool does not test how a particular ATS handles columns, tables, graphics, or vendor-specific fields. Use a simple, readable document and check the exported text yourself when layout parsing is important.",
      },
    ],

    faqs: [
      {
        question: "What is an ATS resume checker?",
        answer:
          "It compares resume text with a job description and reports an estimated match using a fixed heuristic. It does not reproduce the private scoring or parsing rules of a specific applicant tracking system.",
      },
      {
        question: "Is a low ATS score the same as being unqualified?",
        answer:
          "No. This estimate is not a qualification judgment. Review the requirements and evidence individually, and do not add skills or experience that you cannot verify.",
      },
      {
        question: "Which ATS platforms does this check against?",
        answer:
          "It does not score against named platforms. ATS products and employer configurations vary, so the result should be treated as a general estimate only.",
      },
      {
        question: "Is the ATS resume checker free?",
        answer:
          "Yes, your first check is free with no account or card required.",
      },
      {
        question: "How is this different from the resume tailor tool?",
        answer:
          "The ATS checker focuses on requirement coverage and evidence. The <a href=\"/resume-tailor\">resume tailor</a> also drafts role-specific wording for you to review; it should not add unsupported qualifications.",
      },
    ],
  },

  "cover-letter-generator": {
    title: "AI Cover Letter Generator, Sounds Like You | ApplyCraft",
    description:
      "Generate a cover letter that matches your resume and the job, without sounding like a template. Free, no signup needed.",
    keywords: [
      "cover letter generator",
      "AI cover letter",
      "cover letter writer",
      "free cover letter template",
      "personalized cover letter",
    ],

    intro:
      "ApplyCraft's cover letter generator uses the resume and job description text you provide to draft a role-specific letter. The output is a draft: check every claim against your experience and verify any company-specific details before sending it.",

    sections: [
      {
        heading: "Why most cover letters sound robotic",
        body: "Generic templates can lead to broad statements that do not explain why a role fits. Providing both resume and job-description text gives the generator specific source material, but review the result for unsupported details and wording that does not sound like you.",
      },
      {
        heading: "How ApplyCraft writes a more specific letter",
        body: "The generator uses the supplied resume and job posting as context to draft a letter connecting relevant experience with the role. Generated wording can still be inaccurate, so verify each statement and remove anything that overstates your background.",
      },
      {
        heading: "What to still edit yourself",
        body: "A generated cover letter is a strong first draft, not a final one. It's worth reading it once for tone, adding a specific detail about the company, adjusting a phrase that doesn't sound like you, or trimming a paragraph, before sending it, the same way you'd review any first draft.",
      },
    ],

    faqs: [
      {
        question: "Will the cover letter sound like generic AI writing?",
        answer:
          "The prompt asks for specific wording based on the provided resume and job description, but the result may still need editing. Read it for accuracy, tone, and company details before sending.",
      },
      {
        question: "Does it need my resume to work?",
        answer:
          "Both inputs help ground the draft in your supplied experience and the role requirements. Review the result to ensure it accurately represents you.",
      },
      {
        question: "Can I generate multiple cover letters for different jobs?",
        answer:
          "Yes. Each cover letter is generated fresh based on the job description you provide, so you can create a new one for every application.",
      },
      {
        question: "Is the cover letter generator free?",
        answer:
          "Your first cover letter is free with no account or card required. Creating a free account lets you generate more and save your results.",
      },
      {
        question: "Can I edit the cover letter after it's generated?",
        answer:
          "Yes, the generated letter is a starting draft. You can copy it out and edit freely, and we'd recommend a quick personal pass before sending it.",
      },
    ],
  },

  "resume-bullet-improver": {
    title: "AI Resume Bullet Point Improver | ApplyCraft",
    description:
      "Draft clearer resume bullets from your experience. Review each rewrite to confirm it preserves the original meaning and facts.",
    keywords: [
      "resume bullet point generator",
      "improve resume bullets",
      "resume bullet rewriter",
      "action verbs resume",
      "resume achievements generator",
    ],

    intro:
      "A clear bullet helps a reader understand the work performed. ApplyCraft's bullet improver suggests concise wording from the resume text you provide. Its prompts and checks discourage unsupported claims, but you should verify that every rewrite preserves your meaning.",

    sections: [
      {
        heading: "Make bullets clearer while checking the facts",
        body: "A bullet can name the action and context more directly. Not every responsibility has a measurable outcome, and a number should never be added unless the candidate can verify it. Review generated wording for any change in scope or meaning.",
      },
      {
        heading: "What a stronger bullet actually looks like",
        body: "'Helped customers and handled orders' can become 'Assisted customers with product inquiries and processed orders while supporting daily store operations.' The rewrite clarifies the stated work without claiming a metric or an outcome that was not provided.",
      },
      {
        heading: "When a number belongs in a bullet",
        body: "Use a figure only when it comes from your records or a detail you can verify. If a number would help but is not in the source, gather the information yourself before adding it; the tool does not establish missing results.",
      },
    ],

    faqs: [
      {
        question: "Will this make up achievements I didn't have?",
        answer:
          "The prompt and output checks are designed to preserve the source meaning and reject unsupported numeric claims, but they cannot prove every paraphrase is accurate. Review each rewrite and remove anything that overstates your experience.",
      },
      {
        question: "How many bullets can I improve at once?",
        answer:
          "You can provide multiple bullets within the input size limit. Review the returned bullets against the originals before using them.",
      },
      {
        question: "Does this work for non-corporate roles?",
        answer:
          "Yes, the improver is built to handle bullets from any field, including retail, hospitality, and administrative roles, not just office or technical jobs.",
      },
      {
        question: "Is the resume bullet improver free?",
        answer:
          "Yes, your first set of bullet rewrites is free with no account or card required.",
      },
      {
        question: "Should I use this instead of the full resume tailor?",
        answer:
          "Use the <a href=\"/resume-bullet-improver\">bullet improver</a> if you just want stronger phrasing for specific lines. Use the <a href=\"/resume-tailor\">full resume tailor</a> if you want your entire resume optimized against a specific job description.",
      },
    ],
  },

  "resume-summary-generator": {
    title: "AI Resume Summary Generator - Create Professional Summaries",
    description:
      "Create three concise resume-summary drafts based on the experience and skills in your resume.",
    keywords: [
      "resume summary generator",
      "AI resume summary",
      "professional resume summary",
      "resume profile generator",
      "resume introduction generator",
    ],

    intro:
      "A concise summary can help a reader understand a candidate's professional focus. ApplyCraft drafts three short variants from the resume text you provide, without treating the target role as evidence of qualifications.",

    sections: [
      {
        heading: "Resume summary vs. objective statement",
        body: "An objective statement describes what you want from a job; a summary describes relevant experience and skills. Choose the format that best fits your background and the role rather than assuming one is always better.",
      },
      {
        heading: "What makes a summary actually work",
        body: "A useful summary is specific rather than generic. It can describe a professional identity, relevant experience, and verified skills in a few sentences. Include a title, years of experience, or achievement only when the resume supports it.",
      },
      {
        heading: "When to skip a summary entirely",
        body: "Early-career candidates with limited experience sometimes do better leading with education or skills instead of a summary, since a summary built on little experience can read as filler. For anyone with a few years of relevant work history, though, a tailored summary is usually worth including.",
      },
    ],

    faqs: [
      {
        question: "How long should a resume summary be?",
        answer:
          "There is no single required length. This tool returns variants of up to three sentences; keep only details that are relevant and accurate for your background.",
      },
      {
        question: "Resume summary vs. objective, which should I use?",
        answer:
          "A summary, in almost all cases. It leads with what you offer rather than what you want, which tends to land better with recruiters scanning quickly. Objectives are mostly used by students or career-changers with little relevant experience to summarize.",
      },
      {
        question:
          "Does the AI resume summary generator work for career changers?",
        answer:
          "It can highlight transferable skills stated in your resume. A job description can guide emphasis, but it does not establish candidate qualifications; check that each detail is accurate.",
      },
      {
        question: "Is the resume summary generator free?",
        answer:
          "Yes, your first generated summary is free with no account or card required.",
      },
      {
        question: "Can I edit the generated summary afterward?",
        answer:
          "Yes, treat it as a strong first draft. It's worth a quick personal pass to make sure the tone and specific details match how you'd actually describe yourself.",
      },
      {
        question: "Will it just repeat my resume back to me?",
        answer:
          "It aims to synthesize relevant details into a short summary, but may reuse wording or details from your resume. Review the variants to confirm they are accurate and sound like you.",
      },
    ],
  },
};
