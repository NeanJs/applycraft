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
import LoadingProgress from "@/app/components/tools/LoadingProgress";
import ToolForm from "@/app/components/tools/ToolForm";
import GenerateButton from "@/app/components/tools/GenerateButton";
import ToolPageShell, { Tip } from "@/app/components/tools/ToolPageShell";
import ResultPanel from "@/app/components/tools/ResultPanel";

type StepStatus = "done" | "active" | "pending";

// ── Loading progress ──────────────────────────────────────────────────────

// LOADING_STEPS for LoadingProgress
const LOADING_STEPS = [
  { label: "Classifying role type" },
  { label: "Scoring original resume" },
  { label: "Rewriting resume bullets" },
  { label: "Generating cover letter" },
];

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

  const showStickyCTA = !!result && result.promptSignup && !dismissedCTA;

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
    <ToolPageShell
      eyebrow="Resume optimizer"
      title="Tailor your resume to any job."
      description="Paste your resume and the job description, get an ATS score, missing keywords, an optimized resume, and a cover letter."
      steps={[
        { label: "Paste resume", status: step1 },
        { label: "Add job description", status: step2 },
        { label: "Get results", status: step3 },
      ]}
      stickyCTA={
        showStickyCTA ? (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">
                  Like what you see?
                </span>{" "}
                Sign up free to save this and optimize again.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setDismissedCTA(true)}
                className="hidden sm:block text-xs text-gray-400 border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 transition-colors"
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
        ) : undefined
      }
    >
      <ToolForm
        inputs={[
          <ResumeInput
            key="resume"
            value={resume}
            onChange={setResume}
            uploadingPdf={uploadingPdf}
            onPdfUpload={handlePdfUpload}
          />,
          <JobDescriptionInput
            key="jd"
            value={jobDescription}
            onChange={setJobDescription}
          />,
        ]}
        cta={
          <GenerateButton
            onClick={generate}
            disabled={!canGenerate}
            loading={loading}
            label="Optimize resume →"
            loadingLabel="Generating…"
            hint={
              !hasResume || !hasJD
                ? "Paste your resume and a job description to unlock the full optimization."
                : undefined
            }
          />
        }
        tips={
          !loading && !result ? (
            <>
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
            </>
          ) : undefined
        }
        loadingProgress={
          loading ? (
            <LoadingProgress steps={LOADING_STEPS} currentStep={loadingStep} />
          ) : undefined
        }
        result={
          result ? (
            <ResultPanel
              trackerProps={{
                resumeId: result.resumeId ?? null,
                generationId: result.generationId ?? null,
                jobDescription,
                title: "Resume tailor",
                company: result.job?.companyName,
                role: result.job?.jobTitle,
              }}
              footer={
                <>
                  <p className="text-xs text-gray-400">
                    Optimize again by editing above
                  </p>
                  <Link
                    href="/dashboard"
                    className="text-xs font-medium text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors"
                  >
                    ← Back to dashboard
                  </Link>
                </>
              }
            >
              <ResumeResults
                resumeID={result.resumeId ?? undefined}
                result={result}
                copied={false}
              />
            </ResultPanel>
          ) : undefined
        }
      />

      {showSignupCTA && (
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
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
                You&apos;ve used your free optimization
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Sign up to save results, view your cover letter, and optimize
                again.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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
    </ToolPageShell>
  );
}
