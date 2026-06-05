"use client";

import { useState } from "react";
import Link from "next/link";

import { ResponseData } from "@/app/types/types";

import ResumeResults from "@/app/components/ResumeResults";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ResponseData>();
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    const res = await fetch("/api/tailor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, jobDescription }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  const canGenerate = !loading && resume.trim() && jobDescription.trim();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-sm z-20">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-gray-900 inline-block" />
            <span className="text-sm font-semibold tracking-tight">
              ApplyCraft
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm text-gray-500">
            <Link
              href="/dashboard"
              className="hover:text-gray-900 transition-colors"
            >
              ← Dashboard
            </Link>
            <UserButton />
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="mb-10">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
            Resume Optimizer
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Tailor your resume to any job.
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 max-w-lg">
            Paste your resume and the job description — get an ATS score,
            missing keywords, an optimized resume, and a cover letter in
            seconds.
          </p>
        </div>

        {/* Input grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">
              Your Resume
            </label>
            <textarea
              required
              className="w-full h-52 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white placeholder-gray-300 resize-none focus:outline-none focus:border-gray-400 transition-colors leading-relaxed"
              placeholder="Paste your current resume here…"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">
              Job Description
            </label>
            <textarea
              required
              className="w-full h-52 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white placeholder-gray-300 resize-none focus:outline-none focus:border-gray-400 transition-colors leading-relaxed"
              placeholder="Paste the job description here…"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={!canGenerate}
          className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${
            canGenerate
              ? "bg-gray-900 text-white hover:bg-gray-700 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating…
            </span>
          ) : (
            "Optimize Resume →"
          )}
        </button>

        {result && (
          <ResumeResults resumeID={resume} result={result} copied={false} />
        )}

        {/* Post-result actions */}
        {result && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Results generated · Optimize again by editing above
            </p>
            <Link
              href="/dashboard"
              className="text-xs font-medium text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
