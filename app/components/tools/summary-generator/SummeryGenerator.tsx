"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { parseResumeFile } from "@/app/lib/parseResume";

import ToolPageShell, {
  StepStatus,
  Tip,
} from "@/app/components/tools/ToolPageShell";
import ToolForm from "@/app/components/tools/ToolForm";
import ResumeInput from "@/app/components/tools/ResumeInput";
import GenerateButton from "@/app/components/tools/GenerateButton";
import LoadingProgress, {
  LoadingStep,
} from "@/app/components/tools/LoadingProgress";
import ResultPanel from "@/app/components/tools/ResultPanel";

import { useToolEngine } from "@/app/hooks/useToolEngine";
import SignUpCTA from "@/app/components/misc/SignUpCTA";

import { SummaryResult } from "@/app/types/tailor";
import { TAILOR_MODES } from "@/app/lib/ai/prompts/modes/modes";
import SummaryCard from "@/app/components/tools/SummaryCard";
import AnonStickyCTA from "@/app/components/misc/StickyCTA";

const LOADING_STEPS: LoadingStep[] = [
  { label: "Reading your resume", doneLabel: "parsed", doneVariant: "text" },
  { label: "Identifying key strengths" },
  { label: "Drafting your summary" },
];

export default function ResumeSummaryPage() {
  const [resume, setResume] = useState("");
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [showSignupCTA, setShowSignupCTA] = useState(false);
  const [dismissedCTA, setDismissedCTA] = useState(false);

  const { isSignedIn } = useUser();

  const { result, loading, loadingStep, generate } =
    useToolEngine<SummaryResult>({
      apiRoute: "/api/tailor",
      buildBody: () => ({ resume, mode: TAILOR_MODES.SUMMARY_ONLY }),
      validate: () => {
        if (!resume.trim()) return "Please paste your resume.";
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
      successMessage: "Summary ready.",
    });

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    try {
      const text = await parseResumeFile(file);
      setResume(text);
      toast.success("Resume uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to parse PDF.");
    } finally {
      setUploadingPdf(false);
    }
  }

  // Step indicator
  const hasResume = resume.trim().length > 0;
  const step1: StepStatus = hasResume ? "done" : "active";
  const step2: StepStatus = result ? "done" : loading ? "active" : "pending";

  const showStickyCTA = !!result && result.promptSignUp && !dismissedCTA;

  return (
    <ToolPageShell
      eyebrow="Resume Summary"
      title="Summarise yourself in seconds."
      description="Paste your resume and get a sharp, recruiter-ready professional summary you can drop straight into any application."
      steps={[
        { label: "Paste resume", status: step1 },
        { label: "Get summary", status: step2 },
      ]}
      stickyCTA={
        showStickyCTA ? (
          <AnonStickyCTA
            source="summary_bar"
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
        ]}
        cta={
          <GenerateButton
            onClick={generate}
            disabled={loading || uploadingPdf || !hasResume}
            loading={loading}
            label="Generate summary →"
            loadingLabel="Generating…"
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
                label="~15 seconds"
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
              title="Writing your summary"
              eta="~15 seconds"
            />
          ) : undefined
        }
        result={
          result ? (
            <ResultPanel
              footer={
                <>
                  <p className="text-xs text-gray-400">
                    Generate again by editing above
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
              <SummaryCard summaries={result.summaries} />
            </ResultPanel>
          ) : undefined
        }
      />

      {showSignupCTA && (
        <SignUpCTA
          setShowSignupCTA={setShowSignupCTA}
          source="summary_inline_cta"
          title="You've used your free summary"
          description="Sign up to generate more and save your results."
        />
      )}
    </ToolPageShell>
  );
}
