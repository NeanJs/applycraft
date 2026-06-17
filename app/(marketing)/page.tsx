import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import ShowcaseSection from "../components/Showcase";

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
          Paste your resume and a job description. Get an ATS score, rewritten
          resume bullets, and a cover letter that actually sounds like you — in
          30 seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
          <Link
            href="/resume-tailor"
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
          No card, no signup — your resume isn&apos;t stored until you create an
          account
        </p>
      </section>

      {/* ── Interactive showcase ── */}
      <section className="max-w-3xl mx-auto px-6 pb-6">
        <ShowcaseSection />
      </section>

      {/* ── Features ── */}
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

      {/* ── How it works ── */}
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
          href="/resume-tailor"
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
          <p className="text-xs text-gray-400 text-center">
            Crafted with ❤️ By{" "}
            <a
              className="text-blue-700 hover:underline"
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
