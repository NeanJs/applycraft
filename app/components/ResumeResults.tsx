"use client";
import MissingKeywords from "@/app/components/MissingKeywords";
import CoverLetter from "@/app/components/CoverLetter";
import {
  handleDownload,
  handlePDFExport,
  
} from "@/app/services/services";
import { ResponseData, ResumeData } from "@/app/types/types";
import { useState } from "react";
import ResumeTemplate from "../template/resume-template";

export default function ResumeResults({
  result,
  copied,
  resumeID,
}: {
  result: ResponseData;
  copied: boolean;
  resumeID: string;
}) {
  const [localCopied, setLocalCopied] = useState(false);

  const handleCopy = (data: ResumeData) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setLocalCopied(true);
    setTimeout(() => setLocalCopied(false), 2000);
  };

  const isCopied = copied || localCopied;
  const score = result.atsScore;

  const scoreConfig =
    score >= 80
      ? {
          color: "text-emerald-600",
          bar: "bg-emerald-500",
          badge: "bg-emerald-50 border-emerald-200 text-emerald-700",
          hint: "Strong match — ready to apply.",
          label: "Excellent",
          glow: "shadow-emerald-100",
        }
      : score >= 60
        ? {
            color: "text-amber-500",
            bar: "bg-amber-400",
            badge: "bg-amber-50 border-amber-200 text-amber-700",
            hint: "Decent match — consider adding missing keywords.",
            label: "Fair",
            glow: "shadow-amber-100",
          }
        : {
            color: "text-red-500",
            bar: "bg-red-400",
            badge: "bg-red-50 border-red-200 text-red-700",
            hint: "Low match — review keywords below.",
            label: "Low",
            glow: "shadow-red-100",
          };

  return (
    <div className="mt-10 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <section className="px-8 py-8 border-b border-gray-100">
        <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400 mb-6">
          ATS Match Score
        </p>
        <div className="flex items-center gap-8">
          {/* Score circle */}
          <div
            className={`relative flex items-center justify-center w-24 h-24 rounded-full border-2 ${scoreConfig.badge} shadow-lg ${scoreConfig.glow}`}
          >
            <span
              className={`text-3xl font-semibold tabular-nums ${scoreConfig.color}`}
            >
              {score}%
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-800">
                {scoreConfig.hint}
              </p>
              <span
                className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${scoreConfig.badge}`}
              >
                {scoreConfig.label}
              </span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${scoreConfig.bar}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[11px] text-gray-400">0</span>
              <span className="text-[11px] text-gray-400">100</span>
            </div>
          </div>
        </div>
      </section>

      {/* Optimized Resume */}
      <section className="px-8 py-7 border-b border-gray-100 bg-gray-50/40">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400 mb-1">
              Output
            </p>
            <h2 className="text-sm font-semibold text-gray-900">
              Optimized Resume
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <ActionButton onClick={() => handleCopy(result.optimizedResume)}>
              {isCopied ? (
                <>
                  <CheckIcon /> Copied
                </>
              ) : (
                <>
                  <CopyIcon /> Copy JSON
                </>
              )}
            </ActionButton>
            <ActionButton
              onClick={() => handleDownload(result.optimizedResume)}
            >
              <DownloadIcon /> .txt
            </ActionButton>
            <ActionButton onClick={() => handlePDFExport(resumeID)} primary>
              <PDFIcon /> Export PDF
            </ActionButton>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <ResumeTemplate resumeData={result.optimizedResume} />
        </div>
      </section>

      {/* Missing Keywords */}
      <section className="px-8 py-7 border-b border-gray-100">
        <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400 mb-1">
          Gaps
        </p>
        <h2 className="text-sm font-semibold text-gray-900 mb-5">
          Missing Keywords
        </h2>
        <MissingKeywords list={result.missingKeywords} />
      </section>

      {/* Cover Letter */}
      <section className="px-8 py-7">
        <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400 mb-1">
          Generated
        </p>
        <h2 className="text-sm font-semibold text-gray-900 mb-5">
          Cover Letter
        </h2>
        <CoverLetter text={result.coverLetter} />
      </section>
    </div>
  );
}

// ── Small internal primitives ──────────────────────────────────────────────

function ActionButton({
  onClick,
  children,
  primary = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150
        ${
          primary
            ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-700"
            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
        }`}
    >
      {children}
    </button>
  );
}

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <rect
        x="5"
        y="5"
        width="9"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 11H2a1 1 0 01-1-1V2a1 1 0 011-1h8a1 1 0 011 1v1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M2.5 8.5l3.5 3.5 7-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M8 2v8m0 0l-3-3m3 3l3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PDFIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M9 1H3a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V6L9 1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 1v5h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
