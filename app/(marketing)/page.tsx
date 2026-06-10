import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tailor your resume to any job — free",
  description:
    "Paste a job description. ApplyCraft rewrites your resume to match it — ATS score, missing keywords, tailored bullets, and a cover letter in 30 seconds.",
};

// ── Static data ───────────────────────────────────────────────────────────

const features = [
  {
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "ATS optimization",
    desc: "Scores your resume against the job, then rewrites it to rank higher in applicant tracking systems.",
  },
  {
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: "Keyword analysis",
    desc: "Finds every missing skill from the job description and adds them naturally to your resume.",
  },
  {
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Tailored resume",
    desc: "Rewrites your bullet points to mirror the language and priorities of the specific role.",
  },
  {
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    title: "Cover letter",
    desc: "Generates a matching cover letter that sounds like you — not a generic template.",
  },
];

const steps = [
  {
    n: "1",
    title: "Paste your resume",
    desc: "Plain text or PDF. No account needed.",
  },
  {
    n: "2",
    title: "Add the job description",
    desc: "Copy from LinkedIn, Greenhouse, Lever — anywhere.",
  },
  {
    n: "3",
    title: "Get your results",
    desc: "ATS score, rewritten resume, missing keywords, and a cover letter.",
  },
];

const missingKeywords = [
  "TypeScript",
  "Agile",
  "Scrum",
  "System Design",
  "+4 more",
];
const addedKeywords = [
  "TypeScript",
  "Agile",
  "Scrum",
  "System Design",
  "+4 more",
];

const breakdownRows = [
  { label: "Keyword match", after: 89 },
  { label: "Structure", after: 78 },
  { label: "Readability", after: 82 },
  { label: "Role match", after: 94 },
];

// ── Page ──────────────────────────────────────────────────────────────────

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  return <LandingPage />;
}

// ── Primitives ────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-1.5">
      {children}
    </p>
  );
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

// ── Landing page ──────────────────────────────────────────────────────────

function LandingPage() {
  return (
    <div
      className="min-h-screen bg-white text-gray-900"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Hero ── */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3.5 py-1.5 text-xs text-gray-500 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          No account needed &mdash; first one free
        </div>

        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tighter leading-[1.08] text-gray-900 max-w-2xl mx-auto mb-5">
          Your resume, rewritten{" "}
          <span className="text-gray-400">for every job you want.</span>
        </h1>

        <p className="text-base text-gray-500 max-w-sm mx-auto leading-relaxed mb-8">
          Paste your resume and a job description. Get an ATS score, missing
          keywords, a rewritten resume, and a cover letter — in 30 seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
          <Link
            href="/tailor"
            className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Tailor my resume — it&apos;s free →
          </Link>
          <a
            href="#how-it-works"
            className="text-gray-500 px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 hover:border-gray-400 hover:text-gray-900 transition-colors"
          >
            See how it works
          </a>
        </div>
        <p className="text-xs text-gray-400">
          No card, no signup &mdash; one free optimization per day
        </p>
      </section>

      {/* ── Resume mockup ── */}
      <section className="max-w-3xl mx-auto px-6 pb-6">
        <div className="relative">
          {/* Fade out bottom so it bleeds into the ATS section */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
          <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
            {/* Doc chrome bar */}
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
              </div>
              <span className="text-[11px] text-gray-400">resume.pdf</span>
              <div className="w-12" />
            </div>
            <div className="p-7">
              {/* Name + contact */}
              <div className="border-b border-gray-100 pb-5 mb-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="h-5 w-44 bg-gray-900 rounded-sm mb-2" />
                    <div className="flex gap-3">
                      <div className="h-2.5 w-28 bg-gray-200 rounded-full" />
                      <div className="h-2.5 w-20 bg-gray-200 rounded-full" />
                      <div className="h-2.5 w-32 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                  {/* ATS score badge on the mockup */}
                  <div className="flex-shrink-0 ml-4 border border-red-100 bg-red-50 rounded-xl px-4 py-2.5 text-center">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-red-400 mb-0.5">
                      ATS score
                    </p>
                    <p className="text-2xl font-semibold text-red-500 leading-none">
                      54%
                    </p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="mb-5">
                <div className="h-2.5 w-20 bg-gray-300 rounded-full mb-3" />
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <div className="h-3 w-44 bg-gray-800 rounded-full" />
                      <div className="h-2.5 w-20 bg-gray-100 rounded-full" />
                    </div>
                    <div className="h-2.5 w-28 bg-gray-200 rounded-full mb-2" />
                    <div className="space-y-1.5 ml-1">
                      <div className="flex items-start gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-gray-300 mt-1 flex-shrink-0" />
                        <div className="h-2 flex-1 bg-gray-100 rounded-full" />
                      </div>
                      <div className="flex items-start gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-gray-300 mt-1 flex-shrink-0" />
                        <div className="h-2 w-5/6 bg-gray-100 rounded-full" />
                      </div>
                      <div className="flex items-start gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-gray-300 mt-1 flex-shrink-0" />
                        <div className="h-2 w-4/6 bg-gray-100 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <div className="h-2.5 w-12 bg-gray-300 rounded-full mb-3" />
                <div className="flex flex-wrap gap-1.5">
                  {["React", "Node.js", "PostgreSQL", "AWS", "Docker"].map(
                    (s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 text-xs border border-gray-200 rounded text-gray-400"
                      >
                        {s}
                      </span>
                    ),
                  )}
                  {/* Missing keywords highlighted in red */}
                  {["TypeScript", "Agile"].map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 text-xs border border-red-200 rounded text-red-400 bg-red-50"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ATS before/after ── */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        {/* Before card */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden mb-2">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">
              Before — original resume
            </span>
            <span className="text-xs text-gray-400">
              Senior Engineer @ Stripe
            </span>
          </div>
          <div className="p-5 grid grid-cols-2 gap-6 border-b border-gray-100">
            <div>
              <Eyebrow>ATS score</Eyebrow>
              <p className="text-4xl font-semibold text-red-500 mt-1">54%</p>
              <Bar value={54} color="#ef4444" />
            </div>
            <div>
              <Eyebrow>Keywords matched</Eyebrow>
              <p className="text-4xl font-semibold text-gray-400 mt-1">
                6 / 18
              </p>
              <Bar value={33} color="#e5e7eb" />
            </div>
          </div>
          <div className="px-5 py-4">
            <Eyebrow>Missing keywords</Eyebrow>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {missingKeywords.map((k) => (
                <span
                  key={k}
                  className="px-2.5 py-1 text-xs rounded-full bg-red-50 border border-red-200 text-red-700"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Transform divider */}
        <div className="flex items-center gap-3 my-4 text-[11px] text-gray-400">
          <span className="flex-1 h-px bg-gray-200" />
          <span className="flex items-center gap-1.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            ApplyCraft rewrites in 30 seconds
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </span>
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        {/* After card */}
        <div className="border border-emerald-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-emerald-100 bg-emerald-50 flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-800">
              After — ApplyCraft rewrite
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white border border-emerald-200 text-emerald-700">
              optimized
            </span>
          </div>
          <div className="p-5 grid grid-cols-2 gap-6 border-b border-gray-100">
            <div>
              <Eyebrow>ATS score</Eyebrow>
              <p className="text-4xl font-semibold text-emerald-600 mt-1">
                91%
              </p>
              <Bar value={91} color="#10b981" />
            </div>
            <div>
              <Eyebrow>Keywords matched</Eyebrow>
              <p className="text-4xl font-semibold text-gray-900 mt-1">
                17 / 18
              </p>
              <Bar value={94} color="#10b981" />
            </div>
          </div>

          {/* Breakdown */}
          <div className="px-5 py-4 border-b border-gray-100">
            <Eyebrow>Score breakdown</Eyebrow>
            <div className="flex flex-col gap-3 mt-2">
              {breakdownRows.map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-28 flex-shrink-0">
                    {row.label}
                  </span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${row.after}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 w-8 text-right tabular-nums">
                    {row.after}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords added */}
          <div className="px-5 py-4">
            <Eyebrow>Keywords added</Eyebrow>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {addedKeywords.map((k) => (
                <span
                  key={k}
                  className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Social proof ── */}
      <div className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 py-3.5 flex items-center justify-center gap-2 text-xs text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          2,400 resumes optimized this week
        </div>
      </div>

      {/* ── Features — kept exactly as screenshot ── */}
      <section id="features" className="max-w-3xl mx-auto px-6 py-20">
        <Eyebrow>What you get</Eyebrow>
        <h2 className="text-3xl font-semibold tracking-tight mb-2">
          Everything a recruiter wants to see
        </h2>
        <p className="text-sm text-gray-500 mb-8">Four outputs, one paste.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-default"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 mb-3 group-hover:bg-gray-200 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works — kept exactly as screenshot ── */}
      <section
        id="how-it-works"
        className="border-t border-gray-100 bg-gray-50"
      >
        <div className="max-w-3xl mx-auto px-6 py-20">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight mb-10">
            Three steps, thirty seconds
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200 rounded-2xl overflow-hidden">
            {steps.map((s) => (
              <div key={s.n} className="bg-gray-50 px-7 py-8">
                <span className="text-3xl font-semibold text-gray-200 block mb-4">
                  0{s.n}
                </span>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-28 text-center">
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tighter mb-4 leading-[1.08]">
          Stop sending the same resume
          <br />
          <span className="text-gray-400">to every job.</span>
        </h2>
        <p className="text-sm text-gray-500 mb-10 max-w-xs mx-auto leading-relaxed">
          First optimization is free. No card, no signup.
        </p>
        <Link
          href="/tailor"
          className="inline-flex items-center bg-gray-900 text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Tailor my resume — it&apos;s free →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={"logo.ico"} width={32} height={32} alt="ApplyCraftLogo" />
            <span className="text-xs font-medium text-gray-500">
              ApplyCraft
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Crafted with ❤️ By{" "}
            <a
              className="text-blue-700 hoever:underline"
              href="https://nijanadhikari.com.np"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nijan Adhikari
            </a>
          </p>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} ApplyCraft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
