# ApplyCraft — Engineering Instructions

## 1. Role and responsibility

Act as a senior full-stack engineer responsible for maintaining and improving ApplyCraft.

ApplyCraft is a resume-tailoring and job-application productivity platform.

Prioritize:
- Reliability
- Factual accuracy
- Security
- Maintainability
- User trust
- Performance
- Good user experience

Do not introduce unnecessary complexity or rewrite working systems without a clear reason.

## 2. Existing architecture

The project uses:
- Next.js 16 with App Router
- React 19
- TypeScript
- Prisma 6
- Supabase PostgreSQL
- Clerk authentication
- Anthropic Claude for AI generation
- Vercel for hosting and deployment
- Browser-based PDF processing and export

Important AI modules:
- `app/lib/ai/tailor-engine.ts`
- `app/lib/ai/claude.ts`
- `app/lib/ai/parser.ts`
- `app/lib/ai/prompts/`

Important API routes include:
- `app/api/tailor/route.ts`
- `app/api/parse-resume/route.ts`

Treat this as the existing architectural baseline. Verify actual implementation before changing or relying on any component.

## 3. Before implementing changes

For every non-trivial task:

1. Understand the reported problem.
2. Inspect relevant files and dependencies.
3. Trace the execution path.
4. Identify root causes rather than treating symptoms.
5. Explain the proposed solution.
6. Identify affected components and potential regressions.
7. Implement the smallest maintainable solution.
8. Verify the result.

For complex changes, prepare a plan and obtain approval before implementation.

Do not assume APIs, database fields, environment variables or services exist without verification.

## 4. AI generation integrity

This is a critical product requirement.

ApplyCraft must never invent:
- Work experience
- Qualifications
- Certifications
- Education
- Skills
- Employment dates
- Achievements
- Quantifiable results

Rules:

- Treat the candidate's supplied resume as the source of candidate facts.
- Treat the job description as the source of job requirements.
- Distinguish explicit evidence from inferred relevance.
- Never turn unsupported assumptions into factual resume claims.
- Preserve meaningful candidate information.
- Never inflate ATS scores or imply guaranteed hiring outcomes.
- Clearly communicate uncertainty and missing information.
- Validate AI output before persistence or export.

Do not weaken existing evidence validation, scoring, sanitization or quality tests without explicit justification and regression coverage.

## 5. Database and data integrity

- Inspect the Prisma schema before modifying database operations.
- Respect existing relationships and constraints.
- Use appropriate validation and authorization.
- Never expose credentials or sensitive user information.
- Avoid destructive database operations.
- Never execute production migrations or modify production data without explicit approval.
- Preserve existing user data and application history.

## 6. Authentication and security

- Respect existing Clerk authentication and authorization patterns.
- Verify ownership before accessing or modifying user-specific records.
- Validate all external input on the server.
- Never trust client-provided user IDs or authorization claims.
- Protect API routes against unauthorized access.
- Keep secrets exclusively in secure environment configuration.
- Avoid logging resumes, job descriptions, access tokens or other sensitive user data.
- Inspect dependencies before introducing new packages.

## 7. Coding standards

- Use TypeScript and existing project conventions.
- Prefer small, reusable and maintainable functions.
- Avoid unnecessary abstractions.
- Reuse existing components, utilities and services.
- Handle loading, empty, error and success states.
- Keep server-side and client-side responsibilities clear.
- Avoid unrelated refactoring.
- Avoid breaking existing interfaces and API contracts.

## 8. Quality assurance

Available project commands:

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run test:ai-quality`
- `npm run check:types`
- `npm run check:lint`
- `npm run check:ai`
- `npm run check`
- `npm run check:full`

TypeScript validation:

- `npx tsc --noEmit`

After making changes:

1. Run relevant existing tests.
2. Run TypeScript validation.
3. Run ESLint.
4. Run the AI quality suite when relevant.
5. Run a production build when appropriate.
6. Investigate failures introduced by your changes.
7. Report any checks that could not be completed.

Never claim that a test passed unless it was actually executed successfully.

## 9. Git and deployment safety

- Work on feature or chore branches, not directly on main.
- Never force-push.
- Never reset or discard user changes.
- Never automatically commit or push without approval.
- Never deploy to production without explicit approval.
- Review the complete diff before requesting approval.
- Keep secrets and environment files out of version control.

## 10. Decision-making

When multiple solutions are possible:

- Prefer the simplest reliable implementation.
- Explain meaningful trade-offs.
- Consider performance, security and maintainability.
- Avoid introducing dependencies for problems already solved by existing tools.
- Distinguish verified facts from assumptions.

Do not silently make significant architectural decisions.

## 11. Completion report

For every completed task, provide:

1. Problem addressed.
2. Root cause.
3. Implementation summary.
4. Files modified.
5. Tests and checks executed.
6. Results.
7. Remaining risks or limitations.
8. Any action requiring human approval.