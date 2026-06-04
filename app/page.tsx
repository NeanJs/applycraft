import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const features = [
  {
    icon: "✦",
    title: "ATS-Friendly Structure",
    desc: "Formatted to pass applicant tracking systems used by top employers — every time.",
  },
  {
    icon: "⚡",
    title: "Instant Resume Creation",
    desc: "Fill in your details and get a complete, polished resume in seconds.",
  },
  {
    icon: "◈",
    title: "Clean Minimal Design",
    desc: "Distraction-free layouts that let your experience do the talking.",
  },
  {
    icon: "↓",
    title: "PDF Export Ready",
    desc: "Download a pixel-perfect PDF that's ready to send to any recruiter.",
  },
];

const steps = [
  {
    num: "01",
    title: "Sign up",
    desc: "Create a free account in under a minute.",
  },
  {
    num: "02",
    title: "Build your resume",
    desc: "Enter your experience, skills, and education.",
  },
  {
    num: "03",
    title: "Download & apply",
    desc: "Export as PDF and start applying immediately.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) redirect("/dashboard");

  return <LandingPage />;
}

function LandingPage() {
  return (
    <div
      className="min-h-screen bg-white text-gray-900"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Navbar */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-sm z-20">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-gray-900 inline-block" />
            <span className="text-sm font-semibold tracking-tight">
              ApplyCraft
            </span>
          </div>
          <nav className="flex items-center gap-5 text-sm text-gray-500">
            <a
              href="#features"
              className="hover:text-gray-900 transition-colors hidden sm:block"
            >
              Features
            </a>
            <a
              href="#how"
              className="hover:text-gray-900 transition-colors hidden sm:block"
            >
              How it works
            </a>
            <Link
              href="/sign-in"
              className="hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="bg-gray-900 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Get Started →
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-28 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3.5 py-1.5 text-xs text-gray-500 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Free to get started · No credit card required
        </div>

        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tighter leading-[1.1] text-gray-900 max-w-3xl mx-auto">
          Build a job-ready
          <br />
          <span className="text-gray-400">resume in minutes.</span>
        </h1>

        <p className="mt-6 text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
          ApplyCraft generates ATS-optimized resumes tailored to your experience
          — structured, clean, and built to get you interviews.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <SignUpButton>
            <button className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Start for free →
            </button>
          </SignUpButton>
          <SignInButton>
            <button className="text-gray-500 px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 hover:border-gray-400 hover:text-gray-900 transition-colors">
              Sign In
            </button>
          </SignInButton>
        </div>

        {/* Resume mockup */}
        <div className="mt-20 relative max-w-2xl mx-auto">
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none rounded-b-2xl" />
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-left">
            {/* Mock resume header */}
            <div className="border-b border-gray-100 pb-5 mb-5">
              <div className="h-5 w-36 bg-gray-900 rounded-sm mb-2" />
              <div className="flex gap-4">
                <div className="h-3 w-28 bg-gray-200 rounded-full" />
                <div className="h-3 w-24 bg-gray-200 rounded-full" />
                <div className="h-3 w-32 bg-gray-200 rounded-full" />
              </div>
            </div>
            {/* Experience section */}
            <div className="mb-5">
              <div className="h-3 w-20 bg-gray-300 rounded-full mb-3" />
              <div className="flex justify-between mb-1.5">
                <div className="h-3.5 w-40 bg-gray-200 rounded-full" />
                <div className="h-3 w-24 bg-gray-100 rounded-full" />
              </div>
              <div className="space-y-2 ml-1">
                <div className="h-2.5 w-full bg-gray-100 rounded-full" />
                <div className="h-2.5 w-5/6 bg-gray-100 rounded-full" />
                <div className="h-2.5 w-4/6 bg-gray-100 rounded-full" />
              </div>
            </div>
            {/* Skills section */}
            <div>
              <div className="h-3 w-16 bg-gray-300 rounded-full mb-3" />
              <div className="flex flex-wrap gap-2">
                {["TypeScript", "React", "Node.js", "PostgreSQL", "AWS"].map(
                  (s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 text-xs border border-gray-200 rounded-md text-gray-400"
                    >
                      {s}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <div className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-center gap-2 text-xs text-gray-400">
          <span>Trusted by job seekers applying to</span>
          <span className="font-medium text-gray-500">
            Google · Stripe · Airbnb · Shopify · Notion
          </span>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-24">
        <div className="mb-12">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
            Everything you need to land the job
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group border border-gray-200 rounded-xl p-6 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-default"
            >
              <div className="text-2xl mb-4 text-gray-300 group-hover:text-gray-600 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="mb-12">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
              Three steps. One great resume.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200 rounded-xl overflow-hidden">
            {steps.map((s) => (
              <div key={s.num} className="bg-gray-50 px-7 py-8">
                <span className="text-3xl font-semibold text-gray-200 block mb-4">
                  {s.num}
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

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-6 py-28 text-center">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
          Get started
        </p>
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 mb-6">
          Your next job starts
          <br />
          with a great resume.
        </h2>
        <p className="text-gray-500 mb-10 max-w-sm mx-auto text-base leading-relaxed">
          Join thousands of job seekers who use ApplyCraft to build resumes that
          actually get read.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center bg-gray-900 text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Create your resume for free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gray-900 inline-block" />
            <span className="text-xs font-medium text-gray-500">
              ApplyCraft
            </span>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} ApplyCraft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
