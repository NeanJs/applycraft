// import { auth } from "@clerk/nextjs/server";
// import Link from "next/link";
// import { redirect } from "next/navigation";
// import type { Metadata } from "next";
// import ShowcaseSection from "@/app/components/marketing/Showcase";
// import Eyebrow from "@/app/components/marketing/Eyebrow";

// export const metadata: Metadata = {
//   title: "Tailor your resume to any job, free",
//   description:
//     "Paste a job description. ApplyCraft rewrites your resume to match it, ATS score, missing keywords, tailored bullets, and a cover letter in 30 seconds.",
// };

// // ── Static data ───────────────────────────────────────────────────────────

// const features = [
//   {
//     icon: (
//       <svg
//         width="16"
//         height="16"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <circle cx="12" cy="12" r="10" />
//         <circle cx="12" cy="12" r="3" />
//       </svg>
//     ),
//     title: "ATS optimization",
//     desc: "Scores your resume against the job, then rewrites it to rank higher in applicant tracking systems.",
//   },
//   {
//     icon: (
//       <svg
//         width="16"
//         height="16"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <circle cx="11" cy="11" r="8" />
//         <path d="m21 21-4.35-4.35" />
//       </svg>
//     ),
//     title: "Keyword analysis",
//     desc: "Finds every missing skill from the job description and adds them naturally to your resume.",
//   },
//   {
//     icon: (
//       <svg
//         width="16"
//         height="16"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//         <polyline points="14 2 14 8 20 8" />
//         <line x1="16" y1="13" x2="8" y2="13" />
//         <line x1="16" y1="17" x2="8" y2="17" />
//       </svg>
//     ),
//     title: "Tailored resume",
//     desc: "Rewrites your bullet points to mirror the language and priorities of the specific role.",
//   },
//   {
//     icon: (
//       <svg
//         width="16"
//         height="16"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
//         <polyline points="22,6 12,13 2,6" />
//       </svg>
//     ),
//     title: "Cover letter",
//     desc: "Generates a matching cover letter that sounds like you, not a generic template.",
//   },
// ];

// const steps = [
//   {
//     n: "1",
//     title: "Paste your resume",
//     desc: "Plain text or PDF. No account needed.",
//   },
//   {
//     n: "2",
//     title: "Add the job description",
//     desc: "Copy from LinkedIn, Greenhouse, Lever, anywhere.",
//   },
//   {
//     n: "3",
//     title: "Get your results",
//     desc: "ATS score, rewritten resume, missing keywords, and a cover letter.",
//   },
// ];

// const faqs = [
//   {
//     q: "Is my resume data stored or used to train AI?",
//     a: "No. Your resume isn't stored anywhere until you create an account, and we never use your data to train any model.",
//   },
//   {
//     q: "Will this actually work with my company's ATS?",
//     a: "ApplyCraft checks against the same keyword-matching and formatting rules most applicant tracking systems use (Workday, Greenhouse, Lever, Taleo), so the score reflects real-world ATS behavior.",
//   },
//   {
//     q: "What happens after my free optimization?",
//     a: "You can create a free account to save your results and keep going. No card required to get started.",
//   },
//   {
//     q: "Does it work for non-tech roles?",
//     a: "Yes, it's built to handle any role, from retail and hospitality to admin, engineering, and beyond.",
//   },
// ];

// // ── Page ──────────────────────────────────────────────────────────────────

// export default async function Home() {
//   const { userId } = await auth();
//   if (userId) redirect("/dashboard");
//   return <LandingPage />;
// }

// // ── Primitives ────────────────────────────────────────────────────────────

// // ── Landing page ──────────────────────────────────────────────────────────

// function LandingPage() {
//   return (
//     <div
//       className="min-h-screen bg-white text-gray-900"
//       style={{ fontFamily: "'Inter', sans-serif" }}
//     >
//       {/* ── Hero ── */}
//       <section className="max-w-3xl mx-auto px-6 pt-24 pb-8 text-center">
//         <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3.5 py-1.5 text-xs text-gray-500 mb-8">
//           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
//           No account needed &mdash; first one free
//         </div>

//         <h1 className="text-5xl sm:text-6xl font-semibold tracking-tighter leading-[1.08] text-gray-900 max-w-2xl mx-auto mb-5">
//           Your resume, rewritten{" "}
//           <span className="text-gray-400">for every job you want.</span>
//         </h1>

//         <p className="text-base text-gray-500 max-w-sm mx-auto leading-relaxed mb-8">
//           Paste your resume and a job description. Get an ATS score, rewritten
//           resume bullets, and a cover letter that actually sounds like you, in
//           30 seconds.
//         </p>

//         <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
//           <Link
//             href="/resume-tailor"
//             className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
//           >
//             Tailor my resume, it&apos;s free →
//           </Link>
//           <a
//             href="#how-it-works"
//             className="text-gray-500 px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 hover:border-gray-400 hover:text-gray-900 transition-colors"
//           >
//             See how it works
//           </a>
//         </div>

//         {/* Privacy reassurance, bumped up in visual weight, now a standalone badge instead of small footer-style text */}
//         <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 mt-1">
//           <svg
//             width="13"
//             height="13"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className="text-emerald-600"
//           >
//             <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//           </svg>
//           No card, no signup, your resume isn&apos;t stored until you create an
//           account
//         </div>
//       </section>

//       {/* ── Interactive showcase ── */}
//       <section className="max-w-3xl mx-auto px-6 pb-6">
//         <ShowcaseSection />
//       </section>

//       {/* ── Social proof strip ── */}
//       <section className="border-t border-b border-gray-100 bg-gray-50">
//         <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-center">
//           <div>
//             <p className="text-lg font-semibold text-gray-900">+37%</p>
//             <p className="text-xs text-gray-500">avg. ATS score increase</p>
//           </div>
//           <div className="hidden sm:block w-px h-8 bg-gray-200" />
//           <div>
//             <p className="text-lg font-semibold text-gray-900">30 sec</p>
//             <p className="text-xs text-gray-500">average turnaround</p>
//           </div>
//           <div className="hidden sm:block w-px h-8 bg-gray-200" />
//           <div>
//             <p className="text-lg font-semibold text-gray-900">$0</p>
//             <p className="text-xs text-gray-500">to try, no card needed</p>
//           </div>
//         </div>
//       </section>

//       {/* ── Features ── */}
//       <section id="features" className="max-w-3xl mx-auto px-6 py-20">
//         <Eyebrow>What you get</Eyebrow>
//         <h2 className="text-3xl font-semibold tracking-tight mb-2">
//           Everything a recruiter wants to see
//         </h2>
//         <p className="text-sm text-gray-500 mb-8">Four outputs, one paste.</p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {features.map((f) => (
//             <div
//               key={f.title}
//               className="group border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-default"
//             >
//               <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 mb-3 group-hover:bg-gray-200 transition-colors">
//                 {f.icon}
//               </div>
//               <h3 className="text-sm font-semibold text-gray-900 mb-1">
//                 {f.title}
//               </h3>
//               <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── How it works ── */}
//       <section
//         id="how-it-works"
//         className="border-t border-gray-100 bg-gray-50"
//       >
//         <div className="max-w-3xl mx-auto px-6 py-20">
//           <Eyebrow>How it works</Eyebrow>
//           <h2 className="text-3xl font-semibold tracking-tight mb-10">
//             Three steps, thirty seconds
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200 rounded-2xl overflow-hidden">
//             {steps.map((s) => (
//               <div key={s.n} className="bg-gray-50 px-7 py-8">
//                 <span className="text-3xl font-semibold text-gray-200 block mb-4">
//                   0{s.n}
//                 </span>
//                 <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
//                   {s.title}
//                 </h3>
//                 <p className="text-sm text-gray-500 leading-relaxed">
//                   {s.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── FAQ ── */}
//       <section id="faqs" className="max-w-3xl mx-auto px-6 py-20">
//         <Eyebrow>Questions</Eyebrow>
//         <h2 className="text-3xl font-semibold tracking-tight mb-8">
//           Before you paste your resume
//         </h2>
//         <div className="divide-y divide-gray-100 border-t border-gray-100">
//           {faqs.map((f) => (
//             <details key={f.q} className="group py-5">
//               <summary className="flex items-center justify-between cursor-pointer list-none">
//                 <span className="text-sm font-medium text-gray-900">{f.q}</span>
//                 <svg
//                   width="16"
//                   height="16"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="text-gray-400 shrink-0 ml-4 transition-transform group-open:rotate-45"
//                 >
//                   <line x1="12" y1="5" x2="12" y2="19" />
//                   <line x1="5" y1="12" x2="19" y2="12" />
//                 </svg>
//               </summary>
//               <p className="text-sm text-gray-500 leading-relaxed mt-3 pr-8">
//                 {f.a}
//               </p>
//             </details>
//           ))}
//         </div>
//       </section>

//       {/* ── Final CTA ── */}
//       <section className="max-w-3xl mx-auto px-6 py-28 text-center">
//         <h2 className="text-4xl sm:text-5xl font-semibold tracking-tighter mb-4 leading-[1.08]">
//           Stop sending the same resume
//           <br />
//           <span className="text-gray-400">to every job.</span>
//         </h2>
//         <p className="text-sm text-gray-500 mb-10 max-w-xs mx-auto leading-relaxed">
//           First optimization is free. No card, no signup.
//         </p>
//         <Link
//           href="/resume-tailor"
//           className="inline-flex items-center bg-gray-900 text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
//         >
//           Tailor my resume, it&apos;s free →
//         </Link>
//       </section>
//     </div>
//   );
// }
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import ShowcaseSection from "@/app/components/marketing/Showcase";
import Eyebrow from "@/app/components/marketing/Eyebrow";

export const metadata: Metadata = {
  title: "AI Resume Tailor & ATS Resume Checker | ApplyCraft",
  description:
    "Optimize your resume for any job. ApplyCraft analyzes ATS compatibility, finds missing keywords, improves bullet points, and creates a tailored resume from your job description.",
};

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
    title: "ATS score & optimization",
    desc: "Compare your resume against the job description and see exactly what improves your ATS match.",
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
    title: "Resume keyword gap analysis",
    desc: "Find missing skills and keywords from the job posting and add them naturally to your resume.",
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
    title: "Job-specific resume tailoring",
    desc: "Rewrite your experience bullets to match the responsibilities and language recruiters look for.",
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
    title: "Personalized cover letter",
    desc: "Generate a matching cover letter that reflects your experience instead of a generic template.",
  },
];

const steps = [
  {
    n: "1",
    title: "Upload your resume",
    desc: "ApplyCraft analyzes your experience, skills, and achievements.",
  },
  {
    n: "2",
    title: "Paste the job posting",
    desc: "We compare your resume against the role requirements and ATS keywords.",
  },
  {
    n: "3",
    title: "Get your optimization report",
    desc: "See your ATS score, missing keywords, improved bullets, and tailored resume.",
  },
];

const faqs = [
  {
    q: "What is an ATS resume score?",
    a: "An ATS resume score measures how closely your resume matches a job description based on keywords, skills, formatting, and role requirements.",
  },
  {
    q: "How does ApplyCraft optimize my resume?",
    a: "ApplyCraft analyzes your resume against the job posting, identifies missing keywords, improves bullet points, and creates a tailored version for that role.",
  },
  {
    q: "Is my resume data stored or used to train AI?",
    a: "No. Your resume is only stored when you create an account, and your data is never used to train AI models.",
  },
  {
    q: "Can I use ApplyCraft for non-tech jobs?",
    a: "Yes. ApplyCraft works for any role, including engineering, marketing, healthcare, retail, hospitality, administration, and more.",
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
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3.5 py-1.5 text-xs text-gray-500 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Free ATS resume analysis — no signup required
        </div>

        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tighter leading-[1.08] text-gray-900 max-w-2xl mx-auto mb-5">
          Find why your resume
          <br />
          <span className="text-gray-400">isn't matching the job.</span>
        </h1>

        <p className="text-base text-gray-500 max-w-sm mx-auto leading-relaxed mb-8">
          Upload your resume and paste a job description. ApplyCraft finds
          missing keywords, improves your ATS score, and creates a tailored
          resume for that role in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
          <Link
            href="/resume-tailor"
            className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Check my resume, it's free →
          </Link>

          <a
            href="#how-it-works"
            className="text-gray-500 px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 hover:border-gray-400 hover:text-gray-900 transition-colors"
          >
            See how it works
          </a>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 mt-1">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-emerald-600"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          No card required. Your resume isn't stored until you create an
          account.
        </div>
      </section>

      {/* Showcase */}
      <section className="max-w-3xl mx-auto px-6 pb-6">
        <ShowcaseSection />
      </section>

      {/* Trust strip */}
      <section className="border-t border-b border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-900">ATS Analysis</p>
            <p className="text-xs text-gray-500">Understand your resume gaps</p>
          </div>

          <div className="hidden sm:block w-px h-8 bg-gray-200" />

          <div>
            <p className="text-lg font-semibold text-gray-900">30 sec</p>
            <p className="text-xs text-gray-500">Average optimization time</p>
          </div>

          <div className="hidden sm:block w-px h-8 bg-gray-200" />

          <div>
            <p className="text-lg font-semibold text-gray-900">Free</p>
            <p className="text-xs text-gray-500">
              Try before creating an account
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-3xl mx-auto px-6 py-20">
        <Eyebrow>What you get</Eyebrow>

        <h2 className="text-3xl font-semibold tracking-tight mb-2">
          Everything you need to improve your resume
        </h2>

        <p className="text-sm text-gray-500 mb-8">
          Diagnose problems, fix gaps, and tailor your application.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 mb-3">
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
      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-gray-100 bg-gray-50"
      >
        <div className="max-w-3xl mx-auto px-6 py-20">
          <Eyebrow>How it works</Eyebrow>

          <h2 className="text-3xl font-semibold tracking-tight mb-3">
            From resume gaps to a stronger application
          </h2>

          <p className="text-sm text-gray-500 mb-10 max-w-md">
            ApplyCraft doesn't just rewrite your resume. It shows what is
            missing, explains why it matters, and helps you fix it.
          </p>

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

      {/* FAQ */}
      <section id="faqs" className="max-w-3xl mx-auto px-6 py-20">
        <Eyebrow>Questions</Eyebrow>

        <h2 className="text-3xl font-semibold tracking-tight mb-8">
          Before optimizing your resume
        </h2>

        <div className="divide-y divide-gray-100 border-t border-gray-100">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-sm font-medium text-gray-900">{f.q}</span>

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400 shrink-0 ml-4 transition-transform group-open:rotate-45"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </summary>

              <p className="text-sm text-gray-500 leading-relaxed mt-3 pr-8">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-3xl mx-auto px-6 py-28 text-center">
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tighter mb-4 leading-[1.08]">
          Stop guessing why your resume
          <br />
          <span className="text-gray-400">isn't getting responses.</span>
        </h2>

        <p className="text-sm text-gray-500 mb-10 max-w-xs mx-auto leading-relaxed">
          Find missing keywords, improve your ATS score, and tailor your resume
          for the jobs you want.
        </p>

        <Link
          href="/resume-tailor"
          className="inline-flex items-center bg-gray-900 text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Optimize my resume →
        </Link>
      </section>
    </div>
  );
}
