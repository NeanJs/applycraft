import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import ShowcaseSection from "@/app/components/marketing/Showcase";
import Eyebrow from "@/app/components/marketing/Eyebrow";

export const metadata: Metadata = {
  title: "ApplyCraft | Job Tracker, Resume Tailor and ATS Checker",
  description:
    "ApplyCraft helps you track every job application, link each role to the right resume version, and improve ATS match as you go.",
  alternates: {
    canonical: "https://applycraft.xyz/",
  },
  openGraph: {
    title: "ApplyCraft | Job Tracker, Resume Tailor and ATS Checker",
    description:
      "Tailor resumes faster, improve ATS alignment, and manage every application in one place.",
    url: "https://applycraft.xyz/",
    type: "website",
    siteName: "ApplyCraft",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApplyCraft | Job Tracker, Resume Tailor and ATS Checker",
    description:
      "Paste your resume and a job post. Get a tailored resume, ATS insights, and a cleaner application workflow.",
  },
};

const features = [
  {
    title: "Job tracker first workflow",
    desc: "Track every application from Saved to Offer with linked resume versions.",
  },
  {
    title: "ATS gap diagnosis",
    desc: "See missing keywords and weak alignment before you apply.",
  },
  {
    title: "Role-specific rewrites",
    desc: "Generate tailored bullets and resume sections for each role.",
  },
  {
    title: "Resume-to-job linking",
    desc: "Open the exact tailored version you submitted for each company and role.",
  },
];

const steps = [
  {
    n: "1",
    title: "Paste your resume",
    desc: "Use your current version as the baseline.",
  },
  {
    n: "2",
    title: "Add job description",
    desc: "ApplyCraft compares requirements against your profile.",
  },
  {
    n: "3",
    title: "Apply with confidence",
    desc: "Use tailored output and keep each submission organized.",
  },
];

const faqs = [
  {
    q: "Is ApplyCraft free to start?",
    a: "Yes. You can start optimizing right away and create an account when you want to save results.",
  },
  {
    q: "Will my resume be used for model training?",
    a: "No. Your data is not used for model training.",
  },
  {
    q: "Can I use this for non-tech roles?",
    a: "Yes. ApplyCraft is built for any job type, not just software roles.",
  },
  {
    q: "What makes this different from a generic template writer?",
    a: "ApplyCraft is optimized for job applications: ATS alignment, role-specific tailoring, and resume-to-application tracking in one flow.",
  },
];

const HERO_VARIANTS = {
  a: {
    pill: "For job seekers who want better response rates",
    headlinePrefix: "Stop applying with",
    headlineHighlight: " one generic resume",
    description:
      "Track every application in one place, tailor each resume to the role, and keep your entire pipeline organized from Saved to Offer.",
    primaryCta: "Tailor my resume now",
    reassurance: "Free to start. No credit card required.",
    socialProofTitle: "Why people switch",
    socialProofItems: [
      "They stop guessing what recruiters want",
      "They move faster without low-quality copy",
      "They keep every job and resume version linked",
    ],
    closingPrefix: "Ready to submit",
    closingHighlight: " better applications",
    closingDescription:
      "Start with one job description and one resume, then scale your process with confidence.",
    closingCta: "Start free in ApplyCraft",
  },
  b: {
    pill: "Built for applicants sending 10 plus applications a week",
    headlinePrefix: "Your resume should change",
    headlineHighlight: " with every role",
    description:
      "ApplyCraft keeps your job pipeline organized, shows what to fix for each post, and helps you submit stronger, role-specific applications faster.",
    primaryCta: "Optimize for this job",
    reassurance: "Start instantly. Save progress when you create an account.",
    socialProofTitle: "What improves first",
    socialProofItems: [
      "Clear ATS mismatch before you submit",
      "Higher quality role-specific bullets",
      "Less stress from application tracking",
    ],
    closingPrefix: "Want more interviews from",
    closingHighlight: " the same effort",
    closingDescription:
      "Use one focused workflow from resume tailoring to application tracking and stop losing momentum between tools.",
    closingCta: "Try ApplyCraft free",
  },
} as const;

type HeroVariantKey = keyof typeof HERO_VARIANTS;

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ v?: string }>;
}) {
  const { userId } = await auth();

  if (userId) redirect("/dashboard");

  const params = (await searchParams) ?? {};
  const variant: HeroVariantKey = params.v === "b" ? "b" : "a";

  return <LandingPage variant={variant} />;
}

function LandingPage({ variant }: { variant: HeroVariantKey }) {
  const heroCopy = HERO_VARIANTS[variant];

  return (
    <div className="brand-shell min-h-screen text-gray-900">
      <section className="mx-auto max-w-5xl px-6 pb-10 pt-20">
        <div className="brand-card rounded-3xl px-7 py-10 md:px-12 md:py-12">
          <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-center">
            <div>
              <div className="brand-pill mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--mint)]" />
                {heroCopy.pill}
              </div>

              <h1 className="brand-heading text-4xl font-semibold leading-[1.05] md:text-6xl">
                {heroCopy.headlinePrefix}
                <span className="brand-highlight">{heroCopy.headlineHighlight}</span>.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
                {heroCopy.description}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/resume-tailor"
                  className="brand-button-primary rounded-xl px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {heroCopy.primaryCta}
                </Link>
                <a
                  href="#how-it-works"
                  className="brand-button-ghost rounded-xl px-6 py-3 text-sm font-semibold"
                >
                  See how it works
                </a>
              </div>

              <p className="mt-4 text-xs text-[var(--muted)]">
                {heroCopy.reassurance}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-white/90 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                {heroCopy.socialProofTitle}
              </p>
              <div className="mt-4 space-y-3">
                {heroCopy.socialProofItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 rounded-xl border border-[var(--line)] bg-[#f8fbff] px-3 py-2.5"
                  >
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--sky)]" />
                    <p className="text-sm text-[var(--brand-navy)]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-8">
        <div className="rounded-2xl border border-[var(--line)]/80 bg-white/85 p-3 shadow-sm">
          <ShowcaseSection />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-6">
        <div className="brand-card rounded-3xl px-7 py-8 md:px-10 md:py-9">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <Eyebrow>MVP</Eyebrow>
              <h2 className="brand-heading mt-2 text-3xl font-semibold md:text-4xl">
                Job Tracker is the core product
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                Keep every role, status, and resume version in one clear pipeline.
                No more broken spreadsheets or losing track of what was sent where.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-stretch">
              <Link
                href="/sign-up?redirect_url=/tracker"
                className="brand-button-primary rounded-xl px-6 py-3 text-center text-sm font-semibold"
              >
                Start with Job Tracker
              </Link>
              <Link
                href="/tracker"
                className="brand-button-ghost rounded-xl px-6 py-3 text-center text-sm font-semibold"
              >
                Explore tracker
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              "Link every application to the exact tailored resume",
              "Move status from Saved to Offer without losing context",
              "See your pipeline clearly before each follow-up",
            ].map((point) => (
              <div
                key={point}
                className="rounded-xl border border-[var(--line)] bg-white/85 px-4 py-3 text-sm text-[var(--brand-navy)]"
              >
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-5xl px-6 py-12">
        <Eyebrow>What you get</Eyebrow>
        <h2 className="brand-heading mt-2 text-3xl font-semibold md:text-4xl">
          Everything needed to submit stronger applications
        </h2>
        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-[var(--line)] bg-white/90 p-5 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-[var(--brand-navy)]">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-y border-[var(--line)]/70 bg-white/70"
      >
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="brand-heading mt-2 text-3xl font-semibold md:text-4xl">
            Three steps from resume draft to job-ready submission
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm"
              >
                <span className="brand-highlight block text-3xl font-semibold">
                  0{s.n}
                </span>
                <h3 className="mt-4 text-sm font-semibold text-[var(--brand-navy)]">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faqs" className="mx-auto max-w-5xl px-6 py-16">
        <Eyebrow>Questions</Eyebrow>
        <h2 className="brand-heading mt-2 text-3xl font-semibold md:text-4xl">
          Answers before you start
        </h2>

        <div className="mt-8 divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-white/90 px-6">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <span className="text-sm font-semibold text-[var(--brand-navy)]">{f.q}</span>

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-4 shrink-0 text-[var(--muted)] transition-transform group-open:rotate-45"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </summary>

              <p className="mt-3 pr-8 text-sm leading-relaxed text-[var(--muted)]">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }),
        }}
      />

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-2 text-center">
        <div className="brand-card rounded-3xl px-7 py-12 md:px-12">
          <h2 className="brand-heading text-4xl font-semibold leading-[1.08] md:text-5xl">
            {heroCopy.closingPrefix}
            <span className="brand-highlight">{heroCopy.closingHighlight}</span>?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
            {heroCopy.closingDescription}
          </p>

          <Link
            href="/resume-tailor"
            className="brand-button-primary mt-8 inline-flex items-center rounded-xl px-7 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {heroCopy.closingCta}
          </Link>
        </div>
      </section>
    </div>
  );
}
