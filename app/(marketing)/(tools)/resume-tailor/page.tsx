"use client";

import { useState } from "react";
import { ResponseData } from "@/app/types/types";
import ResumeResults from "@/app/components/dashboard/ResumeResults";
import Link from "next/link";
import toast from "react-hot-toast";
import { handleError } from "@/app/lib/errorHandler";
import { useUser } from "@clerk/nextjs";
import { track } from "@vercel/analytics/react";
import { TAILOR_MODES } from "@/app/lib/ai/prompts/modes/modes";
import JobDescriptionInput from "@/app/components/tools/JobDescriptionInput";
import ResumeInput from "@/app/components/tools/ResumeInput";

type StepStatus = "done" | "active" | "pending";

function Step({
  n,
  label,
  status,
}: {
  n: string;
  label: string;
  status: StepStatus;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0 border transition-colors
          ${
            status === "done"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : status === "active"
                ? "bg-gray-900 border-gray-900 text-white"
                : "bg-gray-50 border-gray-200 text-gray-400"
          }`}
      >
        {status === "done" ? (
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <path
              d="M1.5 5l2.5 2.5 4.5-4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          n
        )}
      </div>
      <span
        className={`text-xs ${status === "active" ? "text-gray-900 font-medium" : "text-gray-400"}`}
      >
        {label}
      </span>
    </div>
  );
}

function StepDivider() {
  return <div className="w-px h-4 bg-gray-200 mx-1" />;
}

// ── Loading progress ──────────────────────────────────────────────────────

const LOADING_STEPS = [
  { label: "Classifying role type" },
  { label: "Scoring original resume" },
  { label: "Rewriting resume bullets" },
  { label: "Generating cover letter" },
];

function LoadingProgress({ step }: { step: number }) {
  return (
    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-900">
          Generating your results
        </p>
        <p className="text-xs text-gray-400">~30 seconds</p>
      </div>
      <div className="flex flex-col gap-3">
        {LOADING_STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={s.label} className="flex items-center gap-3 text-sm">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border
                  ${
                    done
                      ? "bg-emerald-50 border-emerald-200"
                      : active
                        ? "bg-white border-gray-300"
                        : "bg-gray-100 border-gray-200"
                  }`}
              >
                {done ? (
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M1.5 5l2.5 2.5 4.5-4.5"
                      stroke="#3b6d11"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : active ? (
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                ) : null}
              </div>
              <span
                className={done || active ? "text-gray-700" : "text-gray-300"}
              >
                {s.label}
              </span>
              {done && i === 0 && (
                <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                  detected
                </span>
              )}
              {done && i === 1 && (
                <span className="ml-auto text-xs text-gray-400">scored</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tip pill ──────────────────────────────────────────────────────────────

function Tip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
      {icon}
      {label}
    </div>
  );
}

// ── Input panel ───────────────────────────────────────────────────────────

// ── Page ──────────────────────────────────────────────────────────────────

export default function TailorPage() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ResponseData>();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showSignupCTA, setShowSignupCTA] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  // Anon Usage CTA
  const [dismissedCTA, setDismissedCTA] = useState(false);
  const isAnon = !result?.saved;
  const showStickyCTA = !!result && isAnon && !dismissedCTA;

  const hasResume = resume.trim().length > 0;
  const hasJD = jobDescription.trim().length > 0;
  const canGenerate = !loading && !uploadingPdf && hasResume && hasJD;
  const { isSignedIn } = useUser();
  // Simulate step progression during loading so the UI isn't static
  async function generate() {
    setLoading(true);
    setLoadingStep(0);
    setResult(undefined);
    setShowSignupCTA(false);
    setDismissedCTA(false);

    const interval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 7000);

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          jobDescription,
          mode: TAILOR_MODES.FULL_OPTIMIZER,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "free_limit_reached") {
          toast.error(data.message);
          setShowSignupCTA(true);
          return;
        }

        toast.error(data.message || "Something went wrong.");
        return;
      }

      toast.success("Your resume is ready.");
      setResult(data);
    } catch (error) {
      handleError(error, "Something went wrong. Please try again later.");
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingStep(0);
    }
  }
  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.text) {
        setResume(data.text);
        toast.success("Resume uploaded.");
      } else {
        toast.error("Could not read the PDF. Try pasting your resume instead.");
      }
    } catch (err) {
      handleError(err, "Failed to parse PDF");
    } finally {
      setUploadingPdf(false);
    }
  }
  // Derive step indicator state
  const step1: StepStatus = hasResume ? "done" : "active";
  const step2: StepStatus =
    hasResume && hasJD ? "done" : hasResume ? "active" : "pending";
  const step3: StepStatus = result ? "done" : loading ? "active" : "pending";

  return (
    <div
      className="min-h-screen bg-white text-gray-900"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Navbar slot */}

      <main
        className={`max-w-5xl mx-auto px-6 py-12 ${showStickyCTA ? "pb-20" : ""}`}
      >
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-2">
            Resume optimizer
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">
            Tailor your resume to any job.
          </h1>
          <p className="text-sm text-gray-500 max-w-lg leading-relaxed mb-5">
            Paste your resume and the job description — get an ATS score,
            missing keywords, an optimized resume, and a cover letter.
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-1 flex-wrap">
            <Step n="1" label="Paste resume" status={step1} />
            <StepDivider />
            <Step n="2" label="Add job description" status={step2} />
            <StepDivider />
            <Step n="3" label="Get results" status={step3} />
          </div>
        </div>

        {/* Input grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <ResumeInput
            onChange={setResume}
            value={resume}
            onPdfUpload={handlePdfUpload}
            uploadingPdf={uploadingPdf}
          />
          {/* <InputPanel
            title="Your resume"
            icon={
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M9 1H3a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V6L9 1z"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 1v5h5M5 9h6M5 11.5h4"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            }
            placeholder="Paste your current resume here…"
            value={resume}
            onChange={setResume}
            maxLength={5000}
            badge={
              hasResume ? (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                  ready
                </span>
              ) : (
                <span className="text-[11px] text-gray-300">
                  {resume.length} / 5000
                </span>
              )
            }
            footer={
              <label className="text-[11px] text-gray-400 flex items-center gap-1 cursor-pointer hover:text-gray-600 transition-colors">
                {uploadingPdf ? (
                  <>
                    <span className="w-2.5 h-2.5 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Parsing PDF…
                  </>
                ) : (
                  <>
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 2v8m0 0l-3-3m3 3l3-3M2 13h12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Upload PDF instead
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handlePdfUpload}
                  disabled={uploadingPdf}
                />
              </label>
            }
          /> */}
          <JobDescriptionInput
            onChange={setJobDescription}
            value={jobDescription}
          />
          {/* <InputPanel
            title="Job description"
            icon={
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect
                  x="1"
                  y="3"
                  width="14"
                  height="11"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
                <path
                  d="M5 7h6M5 10h4"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            }
            placeholder={
              "Paste the full job description here…\n\nTip: include the complete posting for the best keyword match."
            }
            value={jobDescription}
            onChange={setJobDescription}
            maxLength={3000}
            badge={
              hasJD ? (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                  ready
                </span>
              ) : (
                <span className="text-[11px] text-gray-300">0 / 2500</span>
              )
            }
          /> */}
        </div>

        {/* CTA */}
        <button
          onClick={generate}
          disabled={!canGenerate}
          className={`w-full py-3.5 rounded-xl text-sm font-medium transition-all mb-4 ${
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
            "Optimize resume →"
          )}
        </button>

        {/* Trust tips */}
        {!loading && !result && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Tip
              icon={
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <circle
                    cx="8"
                    cy="8"
                    r="6.5"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  />
                  <path
                    d="M8 5v3.5l2 2"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                </svg>
              }
              label="~30 seconds"
            />
            {!isSignedIn && (
              <Tip
                icon={
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                    <rect
                      x="3"
                      y="7"
                      width="10"
                      height="7"
                      rx="1"
                      stroke="currentColor"
                      strokeWidth="1.25"
                    />
                    <path
                      d="M5.5 7V5a2.5 2.5 0 015 0v2"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                    />
                  </svg>
                }
                label="Your data isn't stored"
              />
            )}

            <Tip
              icon={
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1.5l1.5 3.5H13l-2.8 2.2 1 3.5L8 8.7l-3.2 2 1-3.5L3 5h3.5L8 1.5z"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              label="First result is free"
            />
          </div>
        )}

        {/* Loading progress */}
        {loading && <LoadingProgress step={loadingStep} />}

        {/* Results */}
        {result && (
          <ResumeResults
            resumeID={result.resumeId ?? undefined}
            result={result}
            copied={false}
          />
        )}

        {/* Post-result footer */}
        {result && !loading && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Optimize again by editing above
            </p>
            <Link
              href="/dashboard"
              className="text-xs font-medium text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
              ← Back to dashboard
            </Link>
          </div>
        )}
        {showSignupCTA && (
          <div className="mt-6 bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="3"
                    y="7"
                    width="10"
                    height="7"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  />
                  <path
                    d="M5.5 7V5a2.5 2.5 0 015 0v2"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  You've used your free optimization
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sign up to save results, view your cover letter, and optimize
                  again.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowSignupCTA(false)}
                className="text-xs text-gray-400 border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 hover:text-gray-600 transition-colors"
              >
                Maybe later
              </button>
              <Link
                href="/sign-up"
                onClick={() =>
                  track("anon_cta_clicked", { source: "sticky_bar" })
                }
                className="text-xs font-medium text-white bg-gray-900 rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Create free account →
              </Link>
            </div>
          </div>
        )}
        {showStickyCTA && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">
                  Like what you see?
                </span>{" "}
                Sign up free to save this and optimize again.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setDismissedCTA(true)}
                className="hidden sm:block text-xs t text-gray-400 border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 transition-colors"
              >
                Dismiss
              </button>
              <Link
                href="/sign-up"
                onClick={() =>
                  track("anon_cta_clicked", { source: "sticky_bar" })
                }
                className="text-xs font-medium text-white bg-gray-900 rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Create free account →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
