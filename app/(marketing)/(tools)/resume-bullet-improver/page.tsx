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
import { ImprovedBullet, ImprovedBulletsResult } from "@/app/types/tailor";

// ── Types ─────────────────────────────────────────────────────────────────

// ── Loading steps ─────────────────────────────────────────────────────────

const LOADING_STEPS: LoadingStep[] = [
  {
    label: "Extracting existing bullets",
    doneLabel: "extracted",
    doneVariant: "text",
  },
  { label: "Identifying weak phrasing" },
  { label: "Rewriting with strong action verbs" },
  { label: "Aligning to job requirements" },
];

// ── Bullet card ───────────────────────────────────────────────────────────

function BulletCard({ bullets }: { bullets: ImprovedBullet[] }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  function copyOne(text: string, i: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(i);

      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    });
  }

  function copyAll() {
    const text = bullets.map((bullet) => bullet.improved).join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true);

      setTimeout(() => {
        setCopiedAll(false);
      }, 2000);
    });
  }

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
          Improved Bullets
        </span>

        <button
          onClick={copyAll}
          className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-all
            ${
              copiedAll
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
        >
          {copiedAll ? (
            <>
              <CheckIcon />
              Copied all
            </>
          ) : (
            <>
              <CopyIcon />
              Copy all
            </>
          )}
        </button>
      </div>

      {/* Bullet list */}
      <ul className="divide-y divide-gray-100">
        {bullets.map((bullet, i) => (
          <li
            key={i}
            className="group px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            {/* Original */}
            <div className="mb-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                Original
              </p>

              <p className="text-sm text-gray-500 leading-relaxed">
                {bullet.original}
              </p>
            </div>

            {/* Improved */}
            <div className="flex items-start gap-3">
              <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />

              <p className="flex-1 text-sm text-gray-900 leading-relaxed">
                {bullet.improved}
              </p>

              <button
                onClick={() => copyOne(bullet.improved, i)}
                className={`flex-shrink-0 flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all opacity-0 group-hover:opacity-100
                  ${
                    copiedIndex === i
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 opacity-100"
                      : "bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300"
                  }`}
              >
                {copiedIndex === i ? (
                  <>
                    <CheckIcon />
                    Copied
                  </>
                ) : (
                  <>
                    <CopyIcon />
                    Copy
                  </>
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer count */}
      <div className="px-5 py-2.5 border-t border-gray-100">
        <p className="text-[11px] text-gray-400">
          {bullets.length} bullet{bullets.length !== 1 ? "s" : ""} rewritten
        </p>
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
      <rect
        x="5"
        y="5"
        width="9"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />

      <path
        d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path
        d="M1.5 5l2.5 2.5 4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
    useToolEngine<ImprovedBulletsResult>({
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
  const step2: StepStatus = result ? "done" : loading ? "active" : "pending";

  const isAnon = !result?.saved;
  const showStickyCTA = !!result && isAnon && !dismissedCTA;

  return (
    <ToolPageShell
      eyebrow="Improved Bullets"
      title="Make every bullet count."
      description="Paste your resume and get stronger, metrics-driven bullet points that grab a recruiter's attention — optionally tailored to a specific job."
      steps={[
        { label: "Paste resume", status: step1 },
        { label: "Get improved bullets", status: step2 },
      ]}
      stickyCTA={
        showStickyCTA ? (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">
                  Like what you see?
                </span>{" "}
                Sign up free to save this and improve more.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setDismissedCTA(true)}
                className="hidden sm:block text-xs text-gray-400 border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 transition-colors"
              >
                Dismiss
              </button>
              <Link
                href="/sign-up"
                onClick={() =>
                  track("anon_cta_clicked", { source: "bullets_sticky_bar" })
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
              className="flex items-center justify-center gap-2 h-full min-h-[200px] border border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors bg-gray-50/50"
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
              job={result.job}
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
              <BulletCard bullets={result.bullets} />
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
