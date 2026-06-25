// tools.ts
// Full toolSEO config, metadata (used by generateToolMetadata) plus
// SEO content (intro/sections/faqs) consumed by <ToolSeoContent />.

export const toolSEO = {
  "resume-tailor": {
    title: "Tailor your resume to any job, free | ApplyCraft",
    description:
      "Paste a job description. ApplyCraft rewrites your resume to match it, ATS score, missing keywords, tailored bullets, and a cover letter in 30 seconds.",
    keywords: [
      "resume optimizer",
      "ATS resume checker",
      "AI resume writer",
      "cover letter generator",
      "job application tool",
    ],

    intro:
      "A resume tailored to a specific job consistently outperforms a generic one, recruiters spend seconds scanning, and applicant tracking systems score resumes against the exact language in the job posting. ApplyCraft's resume tailor reads your resume and a target job description side by side, then rewrites your bullet points, surfaces missing keywords, and scores how well you'd match before you submit.",

    sections: [
      {
        heading: "Why tailoring beats a one-size-fits-all resume",
        body: "Most applicant tracking systems rank resumes by keyword overlap with the job description before a human ever opens the file. A resume written for 'Software Engineer' in general will miss the specific stack, certifications, or responsibilities listed in any one posting. Tailoring closes that gap, not by inventing experience, but by surfacing and rephrasing what you already did in the language the employer used.",
      },
      {
        heading: "What gets rewritten",
        body: "The tailor tool focuses on three things: bullet points (rewritten to mirror the priorities and phrasing of the job description), keywords (skills and tools mentioned in the posting that your resume is missing), and structure (formatting and section order that ATS software parses reliably). Your work history, dates, and job titles stay factual, only the framing and emphasis shift to match the role.",
      },
      {
        heading: "How long it takes",
        body: "Paste your resume and the job posting, from a PDF, LinkedIn, or any job board, and get a rewritten resume plus an ATS match score in about 30 seconds. No account is required for your first optimization, and nothing is stored unless you choose to create one.",
      },
    ],

    faqs: [
      {
        question: "Does resume tailoring mean lying on my resume?",
        answer:
          "No. Tailoring rewords and reorders real experience to match a job's language and priorities, it doesn't add skills, titles, or experience you don't have. ApplyCraft only works with what's already in your resume.",
      },
      {
        question: "How is this different from a generic resume builder?",
        answer:
          "A resume builder helps you format a resume once. ApplyCraft re-optimizes that resume for every job you apply to, scoring it against the specific posting and rewriting bullet points to match, something a static builder doesn't do.",
      },
      {
        question: "Will a tailored resume actually pass an ATS?",
        answer:
          "ApplyCraft checks your resume against the same keyword-matching and formatting logic used by common ATS platforms like Workday, Greenhouse, and Lever, so the match score reflects how those systems are likely to parse and rank it.",
      },
      {
        question: "Do I need to create an account to try it?",
        answer:
          "No, your first resume optimization is free with no account or card required. Creating a free account lets you save results and run additional optimizations.",
      },
      {
        question: "What file formats can I upload?",
        answer:
          "You can paste your resume as plain text or upload it as a PDF. The job description can be pasted from anywhere, LinkedIn, Greenhouse, Lever, or any job board.",
      },
    ],
  },

  "ats-resume-checker": {
    title: "Free ATS Resume Checker, Scan Your Resume | ApplyCraft",
    description:
      "Check your resume against real ATS rules. Get a match score, missing keywords, and formatting fixes, in seconds, free.",
    keywords: [
      "ATS resume checker",
      "ATS score",
      "resume scanner",
      "applicant tracking system checker",
      "free ATS check",
    ],

    intro:
      "Applicant tracking systems reject a large share of resumes before a recruiter ever sees them, not because the candidate is unqualified, but because the resume is formatted or worded in a way the software can't parse correctly. ApplyCraft's ATS checker scores your resume against the same logic these systems use, so you can fix the gaps before you apply, not after a rejection.",

    sections: [
      {
        heading: "What an ATS actually checks",
        body: "Applicant tracking systems parse resumes into structured fields, contact info, work history, skills, education, then rank candidates by keyword overlap with the job posting and flag formatting issues like tables, columns, headers, or images that don't parse cleanly. A resume can read perfectly to a human and still score poorly here if it uses the wrong layout or misses the terms the job posting uses.",
      },
      {
        heading: "What your score actually means",
        body: "The checker returns a match percentage along with the specific keywords found and missing, so a low score isn't just a number, it points to exactly what to add or rephrase. Scores typically improve significantly once missing hard skills, tools, and certifications mentioned in the job posting are added in the resume's own language.",
      },
      {
        heading: "Formatting issues that quietly hurt your score",
        body: "Multi-column layouts, text inside tables or images, unusual section headers, and non-standard file types can all cause an ATS to misread or skip sections of a resume entirely. The checker flags these structural issues alongside the keyword analysis, since fixing formatting often matters as much as fixing wording.",
      },
    ],

    faqs: [
      {
        question: "What is an ATS resume checker?",
        answer:
          "An ATS resume checker scores your resume against the same rules applicant tracking systems use to rank candidates, keyword matching and formatting, so you can see how your resume is likely to be parsed before you apply.",
      },
      {
        question: "Is a low ATS score the same as being unqualified?",
        answer:
          "No. A low score usually means the resume is missing keywords from the specific job posting or uses formatting the ATS can't parse, not that the candidate lacks the experience. Most scores improve quickly once those gaps are fixed.",
      },
      {
        question: "Which ATS platforms does this check against?",
        answer:
          "The checker is built around the keyword-matching and formatting rules common to widely used platforms like Workday, Greenhouse, Lever, and Taleo.",
      },
      {
        question: "Is the ATS resume checker free?",
        answer:
          "Yes, your first check is free with no account or card required.",
      },
      {
        question: "How is this different from the resume tailor tool?",
        answer:
          "The ATS checker focuses on scoring and diagnosing your resume against a job description. The resume tailor goes a step further and rewrites your resume to fix the gaps it finds.",
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
      "Most AI-generated cover letters read the same way, generic enthusiasm, recycled phrasing, no real connection to the job. ApplyCraft's cover letter generator uses your actual resume and the job description together, so the letter reflects real experience and the specific role instead of filler language a recruiter has read a hundred times.",

    sections: [
      {
        heading: "Why most cover letters sound robotic",
        body: "Generic cover letter tools work from a template and a few prompts, which produces predictable phrasing, 'I am excited to apply' and 'I believe I would be a great fit' show up constantly because they're the safest, most generic things an AI can say. A cover letter grounded in your actual resume and the actual job description has specific details to draw on instead of filler.",
      },
      {
        heading: "How ApplyCraft writes a more specific letter",
        body: "The generator pulls directly from your resume's real experience and the responsibilities listed in the job posting, then writes a letter that connects the two, referencing actual past work rather than vague claims of enthusiasm or fit. The tone aims for confident and direct rather than overly formal or stiff.",
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
          "ApplyCraft is prompted specifically to avoid common AI-sounding phrases and generic enthusiasm, and it draws on your actual resume content rather than filler, but it's still worth a quick personal read-through before sending.",
      },
      {
        question: "Does it need my resume to work?",
        answer:
          "Yes, the generator works best with both your resume and the job description, since it draws specific details from your real experience to connect to the role rather than writing generically.",
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
      "Turn weak resume bullets into strong, ATS-friendly ones with measurable impact. Free, instant rewrites.",
    keywords: [
      "resume bullet point generator",
      "improve resume bullets",
      "resume bullet rewriter",
      "action verbs resume",
      "resume achievements generator",
    ],

    intro:
      "Most resume bullets describe a duty instead of an outcome, 'responsible for managing a team' tells a recruiter what the job was, not what was accomplished in it. ApplyCraft's bullet improver rewrites flat, duty-based bullets into specific, outcome-focused ones that read stronger to both a human reviewer and an ATS keyword scan.",

    sections: [
      {
        heading: "Why 'responsible for' bullets fall flat",
        body: "Phrases like 'responsible for' or 'helped with' describe a role, not a result, and they tend to blur together across resumes because they don't say what actually happened. A bullet point built around a specific action and outcome, what was done, how, and with what measurable effect, stands out and gives an ATS more concrete keywords to match against.",
      },
      {
        heading: "What a stronger bullet actually looks like",
        body: "A strong bullet generally follows action → method → result: what you did, how you did it, and what changed because of it. 'Helped guests during shifts' becomes something like 'Managed multi-table sections during peak service, upselling menu items while maintaining food safety standards', same real experience, written as a specific accomplishment rather than a vague duty.",
      },
      {
        heading: "Adding numbers without inventing them",
        body: "Quantifying impact, team size, percentage improvement, time saved, revenue affected, makes a bullet more credible and scannable, but it should only reflect numbers you can actually stand behind in an interview. The improver will suggest where a number would strengthen a bullet, but the figure itself should come from your real experience.",
      },
    ],

    faqs: [
      {
        question: "Will this make up achievements I didn't have?",
        answer:
          "No. The bullet improver rewrites the framing and wording of your real experience, it doesn't invent metrics, responsibilities, or outcomes you didn't have. Any numbers it suggests should be ones you can verify.",
      },
      {
        question: "How many bullets can I improve at once?",
        answer:
          "You can paste as many bullet points as you'd like rewritten in a single pass, there's no per-bullet limit.",
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
          "Use the bullet improver if you just want stronger phrasing for specific lines. Use the full resume tailor if you want your entire resume optimized against a specific job description.",
      },
    ],
  },

  "resume-summary-generator": {
    title: "AI Resume Summary Generator - Create Professional Summaries",
    description:
      "Create a professional resume summary with AI. Generate a compelling summary that highlights your skills, experience, and career goals.",
    keywords: [
      "resume summary generator",
      "AI resume summary",
      "professional resume summary",
      "resume profile generator",
      "resume introduction generator",
    ],

    intro:
      "A resume summary is the first thing a recruiter reads, and on average they spend only a few seconds deciding whether to keep reading, which makes those two or three opening sentences disproportionately important. ApplyCraft's resume summary generator reads your full resume and writes a sharp, specific opening that highlights your strongest experience instead of a generic statement of career goals.",

    sections: [
      {
        heading: "Resume summary vs. objective statement",
        body: "An objective statement describes what you want from a job; a summary describes what you bring to it. Recruiters generally respond better to summaries because they front-load relevant experience and skills immediately, rather than starting with the candidate's own goals. Most modern resumes use a summary rather than an objective for this reason.",
      },
      {
        heading: "What makes a summary actually work",
        body: "A strong summary is specific rather than generic, it names an actual role, years of experience, and one or two standout skills or achievements, instead of phrases like 'hardworking team player seeking opportunities.' Three to four sentences is usually enough: who you are professionally, your strongest relevant experience, and what you're looking to do next.",
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
          "Three to four sentences is typically enough, long enough to highlight your role, experience level, and a standout skill or achievement, short enough that a recruiter reads the whole thing in the few seconds they spend scanning it.",
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
          "Yes, it can frame transferable skills and relevant experience from a different field in a way that connects to the role you're targeting, rather than just listing your previous job title.",
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
          "No, it identifies your most relevant experience and condenses it into a forward-looking opening statement, rather than just restating your work history in different words.",
      },
    ],
  },
};
