"use client";

import React from "react";

// ── Step indicator ────────────────────────────────────────────────────────

export type StepStatus = "done" | "active" | "pending";

export interface StepDef {
  label: string;
  status: StepStatus;
}

export function Step({
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
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 border transition-colors
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

export function StepDivider() {
  return <div className="w-px h-4 bg-gray-200 mx-1" />;
}

// ── Tip pill ──────────────────────────────────────────────────────────────

export function Tip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
      {icon}
      {label}
    </div>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────

interface ToolPageShellProps {
  /** e.g. "ATS Extractor" or "Resume Summary" */
  eyebrow: string;
  title: string;
  description: string;
  steps: StepDef[];
  /** Optional sticky bottom bar (anon CTA etc.) */
  stickyCTA?: React.ReactNode;
  children: React.ReactNode;
}

export default function ToolPageShell({
  eyebrow,
  title,
  description,
  steps,
  stickyCTA,
  children,
}: ToolPageShellProps) {
  return (
    <div
      className=" bg-white text-gray-900"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <main
        className={`max-w-5xl mx-auto px-6 py-12 ${stickyCTA ? "pb-20" : ""}`}
      >
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-2">
            {eyebrow}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">
            {title}
          </h1>
          <p className="text-sm text-gray-500 max-w-lg leading-relaxed mb-5">
            {description}
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-1 flex-wrap">
            {steps.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <StepDivider />}
                <Step n={String(i + 1)} label={s.label} status={s.status} />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Page body (form, results, etc.) */}
        {children}
      </main>

      {/* Sticky bottom CTA (anon upsell etc.) */}
      {stickyCTA}
    </div>
  );
}
