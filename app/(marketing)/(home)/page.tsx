import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowDown,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  FileText,
  ListChecks,
  MessageSquareText,
  ScanSearch,
} from "lucide-react";

export const metadata: Metadata = {
  title: "ApplyCraft | Your job search, finally in order",
  description:
    "Prepare role-focused resume drafts, review job requirements, and keep applications organized in one workspace.",
  alternates: {
    canonical: "https://applycraft.xyz/",
  },
  openGraph: {
    title: "ApplyCraft | Your job search, finally in order",
    description:
      "Prepare role-focused resume drafts, review job requirements, and keep applications organized in one workspace.",
    url: "https://applycraft.xyz/",
    type: "website",
    siteName: "ApplyCraft",
  },
};

const workflow = [
  {
    number: "01",
    title: "Keep the opportunity",
    description:
      "Save the role, company, job description, and next step in your application tracker.",
    icon: BriefcaseBusiness,
  },
  {
    number: "02",
    title: "Prepare with context",
    description:
      "Compare a job posting with your resume and see which requirements have supporting evidence.",
    icon: ScanSearch,
  },
  {
    number: "03",
    title: "Review before you send",
    description:
      "Get a role-focused resume draft and cover letter, then verify every detail against your experience.",
    icon: FileText,
  },
];

const faqs = [
  {
    question: "What can I do with ApplyCraft?",
    answer:
      "Use the job tracker to organize opportunities, tailor a resume to a posting, review a transparent resume-to-job estimate, improve bullet wording, draft a summary, and prepare a cover letter.",
  },
  {
    question: "Does the match estimate predict an ATS result?",
    answer:
      "No. It is a heuristic based on requirements extracted from the job description and evidence in your resume. It does not reproduce or predict any specific employer's ATS.",
  },
  {
    question: "Will generated content add experience I don't have?",
    answer:
      "The prompts and checks are designed to use your resume as the source for candidate facts. Automated checks cannot verify every paraphrase, so review each statement and remove anything that is not accurate.",
  },
  {
    question: "Can I start without creating an account?",
    answer:
      "You can try a first generation without an account. Sign in to save tailored resumes and manage your applications in the tracker.",
  },
];

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="bg-[var(--brand-warm-white)] text-[var(--brand-ink)]">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 md:min-h-[640px] md:grid-cols-[0.95fr_1.05fr] md:gap-16 md:py-20">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--brand-cobalt)]" />
            A calmer way to manage your search
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            Your job search,
            <span className="block text-[var(--brand-cobalt)]">
              finally in order.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Prepare better applications, keep your documents organized, and
            track every opportunity in one place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-up?redirect_url=/tracker"
              className="brand-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
            >
              Get started free <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a
              href="#workflow"
              className="brand-button-ghost inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
            >
              Explore the workflow <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">
            Try a first generation without an account. Sign in to save your work.
          </p>
        </div>

        <WorkspacePreview />
      </section>

      <section className="border-y border-[var(--line)] bg-white py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 text-xs font-medium text-[var(--muted)] sm:px-8">
          <span>One workspace</span>
          <span aria-hidden="true" className="hidden text-[var(--line)] sm:inline">/</span>
          <span>Role-focused resume drafts</span>
          <span aria-hidden="true" className="hidden text-[var(--line)] sm:inline">/</span>
          <span>Evidence to review</span>
          <span aria-hidden="true" className="hidden text-[var(--line)] sm:inline">/</span>
          <span>Applications kept in context</span>
        </div>
      </section>

      <section
        id="workflow"
        className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28"
      >
        <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr] md:gap-20">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-cobalt)]">
              A connected workflow
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
              From a job post to a considered application.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Keep the role, your application materials, and the next step
              together instead of scattered across tabs and notes.
            </p>
            <Link
              href="/job-tracker"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-cobalt)] hover:underline"
            >
              See the job tracker <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <ol className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {workflow.map(({ number, title, description, icon: Icon }) => (
              <li
                key={number}
                className="grid gap-4 py-6 sm:grid-cols-[56px_1fr_32px] sm:items-start"
              >
                <span className="text-xs font-semibold tabular-nums text-[var(--brand-cobalt)]">
                  {number}
                </span>
                <div>
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-6 text-[var(--muted)]">
                    {description}
                  </p>
                </div>
                <Icon
                  className="hidden text-[var(--brand-cobalt)] sm:block"
                  size={20}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 md:grid-cols-2 md:items-center md:gap-20">
          <div className="order-2 rounded-2xl border border-[var(--line)] bg-[var(--background)] p-5 sm:p-7 md:order-1">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <div>
                <p className="text-xs font-medium text-[var(--muted)]">
                  RESUME TO ROLE
                </p>
                <h3 className="mt-1 text-sm font-semibold">
                  Check evidence, not just keywords
                </h3>
              </div>
              <ScanSearch
                size={20}
                className="text-[var(--brand-cobalt)]"
                aria-hidden="true"
              />
            </div>
            <div className="mt-4 space-y-3">
              <PreviewRequirement
                label="Role requirement"
                value="Review required experience"
                status="Compare"
              />
              <PreviewRequirement
                label="Resume evidence"
                value="See the source excerpt used"
                status="Evidence"
              />
              <PreviewRequirement
                label="Match estimate"
                value="A transparent heuristic"
                status="Estimate"
              />
            </div>
            <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
              Preview of the workflow. Your results depend on the resume and
              job description you provide.
            </p>
          </div>

          <div className="order-1 md:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-cobalt)]">
              Resume tailoring
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
              Make the relevance clearer. Keep the facts yours.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Compare a resume with a specific job description, see which
              requirements have supporting evidence, and review a tailored
              draft before you use it.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Candidate details come from your supplied resume.",
                "Unsupported evidence is shown as missing, not assumed.",
                "ATS estimates are not scores from a specific vendor.",
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-[var(--brand-ink)]">
                  <Check
                    size={17}
                    className="mt-0.5 shrink-0 text-[var(--brand-cobalt)]"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/resume-tailor"
              className="brand-button-primary mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
            >
              Explore resume tailoring <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-cobalt)]">
            Tools for the work around applying
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
            Useful when you need them. Connected to the job.
          </h2>
        </div>
        <div className="mt-10 grid gap-8 border-t border-[var(--line)] pt-7 sm:grid-cols-2 lg:grid-cols-4">
          <ToolSummary
            icon={BriefcaseBusiness}
            title="Job tracker"
            body="Keep role details, status, notes, and associated resume versions together."
            href="/job-tracker"
          />
          <ToolSummary
            icon={ScanSearch}
            title="ATS checker"
            body="Review job requirements alongside the resume evidence and gaps."
            href="/ats-resume-checker"
          />
          <ToolSummary
            icon={MessageSquareText}
            title="Cover letters"
            body="Draft a letter from your resume and the job description, then check it yourself."
            href="/cover-letter-generator"
          />
          <ToolSummary
            icon={ListChecks}
            title="Resume wording"
            body="Improve bullets or draft a concise summary from the details you provide."
            href="/resume-bullet-improver"
          />
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-white py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-cobalt)]">
              Built for your credibility
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em]">
              Your experience stays the source of truth.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-6 text-[var(--muted)]">
            <p>
              A job posting describes what an employer wants. It doesn’t prove
              what you have done. ApplyCraft separates role requirements from
              evidence in the resume you provide.
            </p>
            <p>
              Generated content is a draft for your review. Check titles, dates,
              skills, and every claim before exporting or sending an
              application.
            </p>
            <p>
              Match estimates use a documented heuristic over extracted
              requirements. They are not vendor ATS scores or hiring
              predictions.
            </p>
          </div>
        </div>
      </section>

      <section
        id="faqs"
        className="mx-auto max-w-4xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-cobalt)]">
            Frequently asked
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
            A few things worth knowing.
          </h2>
        </div>
        <div className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold marker:hidden">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="text-xl font-normal text-[var(--brand-cobalt)] transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-3xl pr-8 text-sm leading-6 text-[var(--muted)]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 md:pb-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[1.5rem] bg-[var(--brand-ink)] px-6 py-10 text-white sm:px-10 md:flex-row md:items-center md:justify-between md:px-14 md:py-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8c7ff]">
              Start with the next opportunity
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Make your job search easier to manage.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Keep the role, your materials, and your next step in one place.
            </p>
          </div>
          <Link
            href="/sign-up?redirect_url=/tracker"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--brand-cobalt)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2148c7]"
          >
            Get started free <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
}

function WorkspacePreview() {
  const stages = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -left-3 top-12 hidden h-28 w-28 rounded-full border border-[var(--brand-cobalt)]/10 sm:block" />
      <div className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_24px_70px_-44px_rgba(28,30,37,0.42)]">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-cobalt)]" />
            <span className="text-xs font-semibold">Application workspace</span>
          </div>
          <span className="text-[10px] text-[var(--muted)]">
            Product preview
          </span>
        </div>
        <div className="p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                Job tracker
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">
                Your applications
              </h2>
            </div>
            <span className="rounded-lg border border-[var(--line)] px-2.5 py-1.5 text-[10px] font-medium text-[var(--muted)]">
              Add a role
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {stages.map((stage, index) => (
              <div
                key={stage}
                className={`min-h-28 rounded-lg border p-2 ${
                  index === 0
                    ? "border-[var(--brand-cobalt)]/25 bg-[var(--brand-soft-cobalt)]"
                    : "border-[var(--line)] bg-[var(--background)]"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      index === 0 ? "bg-[var(--brand-cobalt)]" : "bg-[#a3a3a3]"
                    }`}
                  />
                  <span className="text-[10px] font-medium text-[var(--brand-ink)]">
                    {stage}
                  </span>
                </div>
                {index === 0 && (
                  <p className="mt-5 text-[10px] leading-4 text-[var(--muted)]">
                    Add your first opportunity to start tracking.
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-[var(--line)] px-3 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-soft-cobalt)] text-[var(--brand-cobalt)]">
                <FileText size={16} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[11px] font-semibold">Resume tailor</p>
                <p className="mt-0.5 text-[10px] text-[var(--muted)]">
                  Compare resume and job details
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[var(--line)] px-3 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-warm-white)] text-[var(--brand-ink)]">
                <ListChecks size={16} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[11px] font-semibold">Review the result</p>
                <p className="mt-0.5 text-[10px] text-[var(--muted)]">
                  Check every claim before use
                </p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] text-[var(--muted)]">
            Empty-state preview · no sample applicant data
          </p>
        </div>
      </div>
    </div>
  );
}

function PreviewRequirement({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-white px-3.5 py-3">
      <div>
        <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--muted)]">
          {label}
        </p>
        <p className="mt-1 text-xs font-medium">{value}</p>
      </div>
      <span className="rounded-full bg-[var(--brand-soft-cobalt)] px-2.5 py-1 text-[10px] font-medium text-[var(--brand-cobalt)]">
        {status}
      </span>
    </div>
  );
}

function ToolSummary({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: typeof BriefcaseBusiness;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl p-2 outline-offset-4 transition-colors hover:bg-white"
    >
      <Icon
        size={20}
        strokeWidth={1.7}
        className="text-[var(--brand-cobalt)]"
        aria-hidden="true"
      />
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-cobalt)]">
        Learn more
        <ArrowRight
          size={14}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
