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
        className={`h-5 w-5 shrink-0 rounded-full border text-[10px] font-medium flex items-center justify-center transition-colors
          ${
            status === "done"
              ? "border-[#2fa287]/40 bg-[#2fa287]/12 text-[#1f7f69]"
              : status === "active"
                ? "border-[#f26f21] bg-[#f26f21] text-white"
                : "border-(--line) bg-white text-[#7a8799]"
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
        className={`text-xs ${status === "active" ? "font-semibold text-[#12223d]" : "text-[#74849a]"}`}
      >
        {label}
      </span>
    </div>
  );
}

export function StepDivider() {
  return <div className="mx-1 h-4 w-px bg-(--line)" />;
}

// ── Tip pill ──────────────────────────────────────────────────────────────

export function Tip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#2f9ecf]/30 bg-[#2f9ecf]/10 px-3 py-1 text-[11px] text-[#29557a]">
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
    <div className="brand-shell text-gray-900">
      <main
        id="tool-workspace"
        className={`mx-auto max-w-5xl px-6 py-12 ${stickyCTA ? "pb-20" : ""}`}
      >
        <section className="brand-card mb-8 rounded-3xl p-6 md:p-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[#5a789a]">
            {eyebrow}
          </p>
          <h1 className="brand-heading mb-2 text-3xl font-semibold tracking-tight text-[#10213b] md:text-4xl">
            {title}
          </h1>
          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[#516077] md:text-base">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-1">
            {steps.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <StepDivider />}
                <Step n={String(i + 1)} label={s.label} status={s.status} />
              </React.Fragment>
            ))}
          </div>
        </section>

        {children}
      </main>

      {stickyCTA}
    </div>
  );
}
