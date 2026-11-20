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
import JobDescriptionInput from "@/app/components/tools/JobDescriptionInput";
import GenerateButton from "@/app/components/tools/GenerateButton";
import LoadingProgress, {
  LoadingStep,
} from "@/app/components/tools/LoadingProgress";
import ResultPanel from "@/app/components/tools/ResultPanel";
import { useToolEngine } from "@/app/hooks/useToolEngine";
import SignUpCTA from "@/app/components/misc/SignUpCTA";

import { TAILOR_MODES } from "@/app/lib/ai/prompts/modes/modes";
import { ExperienceOptimizerResults } from "@/app/types/tailor";
import AnonStickyCTA from "@/app/components/misc/StickyCTA";
import QuickStartSamples from "@/app/components/tools/QuickStartSamples";
import {
  SAMPLE_JOB_DESCRIPTION_TEXT,
  SAMPLE_RESUME_TEXT,
} from "@/app/constant/toolSamples";

// ── Types ─────────────────────────────────────────────────────────────────

// ── Loading steps ─────────────────────────────────────────────────────────

const LOADING_STEPS: LoadingStep[] = [
  {
    label: "Extracting existing experience",
    doneLabel: "extracted",
    doneVariant: "text",
  },
  { label: "Identifying weak phrasing" },
  { label: "Rewriting with strong action verbs" },
  { label: "Aligning to job requirements" },
];

// ── Bullet card ───────────────────────────────────────────────────────────

import ExperienceOptimizerCard from "@/app/components/tools/resume-bullet-improver/ExperienceOptimizerCard";

// ── Page ──────────────────────────────────────────────────────────────────

export default function ImprovedBulletsPage() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [showSignupCTA, setShowSignupCTA] = useState(false);
  const [dismissedCTA, setDismissedCTA] = useState(false);
  const [showJD, setShowJD] = useState(false);

  const { isSignedIn } = useUser();

  const { result, loading, loadingStep, generate } =
    useToolEngine<ExperienceOptimizerResults>({
      apiRoute: "/api/tailor",
      buildBody: () => ({
        resume,
        ...(showJD && jobDescription.trim() ? { jobDescription } : {}),
        mode: TAILOR_MODES.BULLET_IMPROVER,
      }),
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
      successMessage: "Bullets improved.",
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
  const hasJD = jobDescription.trim().length > 0;
  const hasAnyInput = hasResume || hasJD;
  const step1: StepStatus = hasResume ? "done" : "active";
  const step2: StepStatus = result ? "done" : loading ? "active" : "pending";

  const showStickyCTA = !!result && result.promptSignUp && !dismissedCTA;

  function handleTrySampleData() {
    setResume(SAMPLE_RESUME_TEXT);
    setShowJD(true);
    setJobDescription(SAMPLE_JOB_DESCRIPTION_TEXT);
    setShowSignupCTA(false);
    setDismissedCTA(false);
  }

  function handleClearInputs() {
    setResume("");
    setJobDescription("");
    setShowJD(false);
    setShowSignupCTA(false);
    setDismissedCTA(false);
  }

  return (
    <ToolPageShell
      eyebrow="Improved Bullets"
      title="Make every bullet count."
      description="Paste your resume and get clearer bullet point drafts that keep your supplied facts as the source, optionally tailored to a specific job."
      steps={[
        { label: "Paste resume", status: step1 },
        { label: "Get improved bullets", status: step2 },
      ]}
      stickyCTA={
        showStickyCTA ? (
          <AnonStickyCTA
            source="bullets_improver"
            onDismiss={() => setDismissedCTA(true)}
          />
        ) : undefined
      }
    >
      {!loading && !result && (
        <QuickStartSamples
          onTrySample={handleTrySampleData}
          onClear={handleClearInputs}
          hasInput={hasAnyInput}
          loading={uploadingPdf}
        />
      )}

      <ToolForm
        inputs={[
          <ResumeInput
            key="resume"
            value={resume}
            onChange={setResume}
            uploadingPdf={uploadingPdf}
            onPdfUpload={handlePdfUpload}
          />,
          // Optional JD toggle
          showJD ? (
            <div key="jd" className="relative">
              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
              />
              <button
                onClick={() => {
                  setShowJD(false);
                }}
                className="absolute top-3 right-4 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                Remove ✕
              </button>
            </div>
          ) : (
            <button
              key="add-jd"
              onClick={() => setShowJD(true)}
              className="flex items-center justify-center gap-2 h-full min-h-50 border border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors bg-gray-50/50"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3v10M3 8h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Add job description to tailor bullets
            </button>
          ),
        ]}
        cta={
          <GenerateButton
            onClick={generate}
            disabled={loading || uploadingPdf || !hasResume}
            loading={loading}
            label="Improve bullets →"
            loadingLabel="Rewriting…"
            hint={!hasResume ? "Paste your resume to unlock improved bullets." : undefined}
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
                label="~25 seconds"
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
                  label="Not saved to your account"
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
              {showJD && hasJD && (
                <Tip
                  icon={
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2 8h12M8 2l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                  label="Tailored to this job"
                />
              )}
            </>
          ) : undefined
        }
        loadingProgress={
          loading ? (
            <LoadingProgress
              steps={LOADING_STEPS}
              currentStep={loadingStep}
              title="Rewriting your bullets"
              eta="~25 seconds"
            />
          ) : undefined
        }
        result={
          result ? (
            <ResultPanel
              job={result.job ?? undefined}
              trackerProps={{
                resumeId: (result as { resumeId?: string | null }).resumeId ?? null,
                generationId: (result as { generationId?: string | null }).generationId ?? null,
                jobDescription: showJD ? jobDescription : undefined,
                title: "Bullet improvement",
                company: result.job?.companyName,
                role: result.job?.jobTitle,
              }}
              footer={
                <>
                  <p className="text-xs text-gray-400">
                    Improve again by editing above
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
              <ExperienceOptimizerCard experiences={result.experiences} />
            </ResultPanel>
          ) : undefined
        }
      />

      {showSignupCTA && (
        <SignUpCTA
          setShowSignupCTA={setShowSignupCTA}
          source="bullets_inline_cta"
          title="You've used your free rewrite"
          description="Sign up to improve more bullets and save your results."
        />
      )}
    </ToolPageShell>
  );
}
