"use client";

import { useState } from "react";
import { handleDownload } from "./services/download";
import { ResponseData, ResumeData } from "./types/types";

import ResumePreview from "./components/ResumePreview";
const ResultSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-3">
    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    {children}
  </section>
);

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ResponseData>();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);

    const res = await fetch("/api/tailor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume,
        jobDescription,
      }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }
  const handleCopy = async (copiedData: ResumeData) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(copiedData, null, 2));
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900">ApplyCraft</h1>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed">
            Paste your resume + job description. Get an ATS-optimized resume,
            missing keywords, and a tailored cover letter in seconds.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Free AI resume optimization tool
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Resume
            </label>
            <textarea
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-black"
              placeholder="Paste your resume here"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-black"
              placeholder="Paste the job description here"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-10">
            {/* ATS Score */}
            <div className="flex items-center gap-4 pb-8 border-b border-gray-200">
              <div className="text-6xl font-bold text-blue-600">
                {result?.atsScore}%
              </div>
              <div>
                <p className="text-sm text-gray-600">ATS Match Score</p>
              </div>
            </div>

            {/* Optimized Resume */}
            <ResultSection title="Optimized Resume">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 self-end">
                  <button
                    className=" text-white bg-blue-600 p-2"
                    onClick={() => handleCopy(result.optimizedResume)}
                  >
                    {copied ? "Copied✓" : "Copy JSON"}
                  </button>
                  <button
                    className="text-white bg-blue-600 p-2"
                    onClick={() => handleDownload(result.optimizedResume)}
                  >
                    Download Plain Text
                  </button>
                  {/* <button
                    className="text-white bg-blue-600 p-2"
                    onClick={() => downloadPDF(result.optimizedResume)}
                  >
                    Export PDF
                  </button> */}
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 overflow-auto max-h-96">
                  <ResumePreview responseData={result.optimizedResume} />
                </div>
              </div>
            </ResultSection>

            {/* Missing Keywords */}
            <ResultSection title="Missing Keywords">
              <ul className="grid grid-cols-2 gap-3">
                {result?.missingKeywords?.map((keyword: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <span className="text-blue-500 font-semibold">•</span>
                    <span>{keyword}</span>
                  </li>
                ))}
              </ul>
            </ResultSection>

            {/* Cover Letter */}
            <ResultSection title="Cover Letter">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 overflow-auto max-h-96">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                  {result?.coverLetter}
                </pre>
              </div>
            </ResultSection>

            {/* Continue Prompt */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-10">
              <p className="font-semibold text-gray-900">
                Want another resume?
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Just paste a new job description above and generate again.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
