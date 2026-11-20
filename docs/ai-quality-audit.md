# AI quality pipeline audit

## Pipeline

Resume and job-description input reaches `app/api/tailor/route.ts` (or the dedicated cover-letter route), then `app/lib/ai/tailor-engine.ts`. Mode prompts live in `app/lib/ai/prompts/`; Claude calls are centralized in `app/lib/ai/claude.ts`, and `app/lib/ai/parser.ts` extracts JSON. Static system prompts use Anthropic's one-hour ephemeral prompt cache; user resume and job-description text are not explicitly cached at Anthropic. Successful outputs are cached for 24 hours by lookup age and, for full tailoring, persisted as resume data. The cache's database rows are not physically expired or automatically purged after 24 hours. Tool results are no longer redundantly posted with the full input and result to `/api/anon-generation`; the remaining database cache still stores generated output. Full resume generation returns before a separate cover-letter request completes. The resume PDF parser is `app/api/parse-resume/route.ts`; the text and PDF exports use the shared resume data model and template.

The current model is `claude-sonnet-4-6`. Each operation now has a mode-specific output budget, and successful requests record input/output tokens, prompt-cache read/write tokens, and latency. The same model remains in use across modes because the repository has no comparative quality measurements to justify routing factual resume generation to a cheaper model. Transient API retry behavior remains the Anthropic SDK default. Malformed JSON is rejected rather than sent to a second model call that could alter candidate facts while “repairing” the response.

## Quality problems found and changes made

- Resume and job-description strings were truncated to 5,000 and 3,000 characters in the engine, while PDF extraction flattened line breaks and silently truncated resumes. Inputs now have explicit 20,000/12,000-character limits, are rejected rather than silently shortened, and PDF extraction preserves section and bullet line breaks.
- The full-tailoring prompt asked the model to calculate ATS scores without a defined formula. The ATS-only prompt similarly used an ambiguous “relevant keywords” denominator. Both now provide extracted requirements and evidence; server code calculates scores using one shared rubric.
- ATS missing-term chips were assigned high/medium/low priority by list position, not job-description importance. Those invented priorities were removed. Requirements now retain required/preferred status and a candidate-evidence excerpt.
- The base prompt did not distinguish job requirements from candidate evidence. Mode prompts now make the resume the only source of candidate facts and request verbatim evidence excerpts. Evidence not found in the supplied resume is cleared and treated as missing; extracted requirements not supported by the job description are omitted instead of failing the generation.
- Parsed JSON was not schema-checked before caching or persistence. Mode-specific validation now checks required response structure, requirement evidence, structured resume metadata, and bullet counts before returning or caching output. Unsupported requirement evidence and structured metadata are cleared or filtered rather than causing the entire generation to fail; sentences with unsupported numeric claims are removed. The plain-text resume export now includes optional LinkedIn, GitHub, website, project links, GPA, and honors fields as well as existing sections.
- The JSON repair call could change values, and output limits were too small for complete resumes. Repair was removed and output budgets were raised by mode.
- ATS scores are labeled estimates, not scores from a particular system or predictions of hiring outcomes. Prompt versioning invalidates outputs generated under the earlier rubric.

## Score rubric

For each applicable extracted requirement, verbatim resume evidence yields a strong match when at least 75% of meaningful requirement terms occur in the evidence; partial evidence yields a partial match; no evidence is a missing match. Not-applicable requirements are excluded. Required requirements have weight 2, preferred requirements weight 1; strong and partial matches count as 1 and 0.5 respectively.

The overall estimate is 40% weighted keyword coverage, 30% role coverage (responsibilities, experience, and seniority; falling back to all requirements if those categories are absent), 15% section structure, and 15% bullet length. Structure checks for contact information, summary, skills, experience, and education. Bullet readability counts bullets with 5–35 words and no more than 240 characters. The score is a repeatable heuristic over the extracted requirement set, not an ATS vendor score.

## Evaluation and limitations

`app/lib/ai/quality-fixtures.json` contains six representative candidate/job pairs (entry-level, international student, career changer, experienced technical, technical transition, and non-technical). `npm run test:ai-quality` tests evidence classification, weighting, deterministic scoring, and sanitization of unsupported claims. These tests do not call Claude and therefore do not establish comparative prompt quality or a hallucination rate.

Source-quote checks establish that requirement evidence excerpts occur in the supplied resume; they cannot prove semantic entailment. They do not currently trace every generated free-text summary, bullet, project description, or cover-letter claim to a source excerpt. The numeric check covers digits, not spelled-out numbers or every unsupported non-numeric claim. Job requirement extraction and applicability are still model-assisted, so identical scoring rules do not guarantee identical requirement extraction across model runs. Candidates should review the output before using it.

The anonymous tool UI says results are not saved to the user's account. Generated results may still be present in the server-side model-output cache, and its 24-hour age limit controls cache reuse rather than database retention. The current results screen exposes requirement status and evidence, but does not yet support per-field accept/reject, editing and saving individual suggestions, or regeneration of a selected section. The current PDF and text export paths remain available. No claim is made that the system is hallucination-free or that a score predicts an ATS decision.

## Recommended next steps

1. Add model-output provenance for every generated candidate claim, validate the excerpts against the source resume, and surface those excerpts beside editable suggestions. Keep this as traceability, not a claim of automatic semantic verification.
2. Define and implement a database retention policy for cached outputs; the current 24-hour setting is a lookup TTL only.
3. Build a human-reviewed, de-identified evaluation set with expected source facts, requirement categories, and acceptable rewrites before changing prompts or routing models.
4. Add per-section edit, accept/reject, and regeneration controls, and ensure the reviewed version is the one persisted and exported.
