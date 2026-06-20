"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { track } from "@vercel/analytics/react";

import ToolPageShell, {
  StepStatus,
  Tip,
} from "@/app/components/tools/ToolPageShell";
import ToolForm from "@/app/components/tools/ToolForm";
import ResumeInput from "@/app/components/tools/ResumeInput";
import JobDescriptionInput from "@/app/components/tools/JobDescriptionInput";
import GenerateButton from "@/app/components/tools/GenerateButton";
import LoadingProgress, {
  LoadingStep,
} from "@/app/components/tools/LoadingProgress";
import ResultPanel from "@/app/components/tools/ResultPanel";

import { useToolEngine } from "@/app/hooks/useToolEngine";
import SignUpCTA from "@/app/components/SingUpCTA";
import { TAILOR_MODES } from "@/app/lib/ai/prompts/modes/modes";
import CoverLetter from "@/app/components/CoverLetter";

import { CoverLetterResult } from "@/app/types/tailor";
import AnonStickyCTA from "@/app/components/misc/StickyCTA";

// ── Types ─────────────────────────────────────────────────────────────────

// ── Loading steps ─────────────────────────────────────────────────────────

const LOADING_STEPS: LoadingStep[] = [
  {
    label: "Classifying role type",
    doneLabel: "detected",
    doneVariant: "badge",
  },
  { label: "Matching your experience to the role" },
  { label: "Drafting your cover letter" },
  { label: "Polishing tone and structure" },
];

// ── Page ──────────────────────────────────────────────────────────────────

export default function CoverLetterPage() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [showSignupCTA, setShowSignupCTA] = useState(false);
  const [dismissedCTA, setDismissedCTA] = useState(false);

  const { isSignedIn } = useUser();

  const { result, loading, loadingStep, generate } =
    useToolEngine<CoverLetterResult>({
      apiRoute: "/api/tailor",
      buildBody: () => ({
        resume,
        jobDescription,
        mode: TAILOR_MODES.COVER_LETTER_ONLY,
      }),
      validate: () => {
        if (!resume.trim()) return "Please paste your resume.";
        if (!jobDescription.trim()) return "Please paste the job description.";
        return null;
      },
      stepCount: LOADING_STEPS.length,
      onKnownError: (code, message) => {
        if (code === "free_limit_reached") {
          toast.error(message);
          setShowSignupCTA(true);
        } else {
          toast.error(message);
        }
      },
      successMessage: "Cover letter ready.",
    });

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
        toast.error("Could not read the PDF. Try pasting instead.");
      }
    } catch {
      toast.error("Failed to parse PDF.");
    } finally {
      setUploadingPdf(false);
    }
  }

  // Step indicator
  const hasResume = resume.trim().length > 0;
  const hasJD = jobDescription.trim().length > 0;
  const step1: StepStatus = hasResume ? "done" : "active";
  const step2: StepStatus =
    hasResume && hasJD ? "done" : hasResume ? "active" : "pending";
  const step3: StepStatus = result ? "done" : loading ? "active" : "pending";

  const showStickyCTA = !!result && result.promptSignUp && !dismissedCTA;

  return (
    <ToolPageShell
      eyebrow="Cover Letter"
      title="A cover letter written for this job."
      description="Paste your resume and the job posting — get a tailored cover letter that connects your experience to exactly what they're looking for."
      steps={[
        { label: "Paste resume", status: step1 },
        { label: "Add job description", status: step2 },
        { label: "Get cover letter", status: step3 },
      ]}
      stickyCTA={
        showStickyCTA ? (
          <AnonStickyCTA
            source="coverletter_bar"
            onDismiss={() => setDismissedCTA(true)}
          />
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
            disabled={loading || uploadingPdf || !hasResume || !hasJD}
            loading={loading}
            label="Write cover letter →"
            loadingLabel="Writing…"
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
            <LoadingProgress
              steps={LOADING_STEPS}
              currentStep={loadingStep}
              title="Writing your cover letter"
            />
          ) : undefined
        }
        result={
          result ? (
            <ResultPanel
              job={result.job}
              footer={
                <>
                  <p className="text-xs text-gray-400">
                    Write again by editing above
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
              <CoverLetter text={result.coverLetter} />
            </ResultPanel>
          ) : undefined
        }
      />

      {showSignupCTA && (
        <SignUpCTA
          setShowSignupCTA={setShowSignupCTA}
          source="cover_letter_inline_cta"
          title="You've used your free cover letter"
          description="Sign up to write more and save your results."
        />
      )}
    </ToolPageShell>
  );
}
