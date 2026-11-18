"use client";

import { useEffect, useState } from "react";

export interface LoadingStep {
  label: string;
  detail?: string;
  doneLabel?: string; // optional badge/text shown when done, e.g. "detected" or "scored"
  doneVariant?: "badge" | "text"; // "badge" = pill, "text" = plain xs text
}

interface LoadingProgressProps {
  steps: LoadingStep[];
  currentStep: number;
  title?: string;
  eta?: string;
  helperText?: string;
  progressNote?: string;
}

export default function LoadingProgress({
  steps,
  currentStep,
  title = "Generating your results",
  eta = "In progress",
  helperText = "Your request is being processed. It can take a little while; your result will appear here when it is ready.",
  progressNote = "The step indicator is a guide, not live model telemetry.",
}: LoadingProgressProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const interval = setInterval(
      () => setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  const elapsedLabel = `${Math.floor(elapsedSeconds / 60)}:${String(
    elapsedSeconds % 60,
  ).padStart(2, "0")} elapsed`;

  return (
    <div
      className="mt-6 overflow-hidden rounded-2xl border border-[#d8dee8] bg-white shadow-sm"
      role="region"
      aria-label={title}
    >
      <div className="h-1 overflow-hidden bg-[#edf1f5]">
        <div className="loading-progress-indicator h-full w-1/3 rounded-full bg-[#f26f21]" />
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="h-5 w-5 shrink-0 rounded-full border-2 border-[#f26f21]/25 border-t-[#f26f21] motion-safe:animate-spin motion-reduce:animate-none"
            />
            <p className="text-sm font-semibold text-[#12223d]">{title}</p>
          </div>
          <p className="shrink-0 text-right text-xs text-gray-400">
            <span>{eta}</span>
            <span className="ml-2 tabular-nums" aria-hidden="true">
              {elapsedLabel}
            </span>
          </p>
        </div>
        <p className="mb-5 pl-8 text-sm leading-relaxed text-[#617087]">
          {helperText}
        </p>
        <div className="flex flex-col gap-3" aria-label="Generation progress">
          {steps.map((s, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div
                key={s.label}
                className="flex items-center gap-3 text-sm"
                aria-current={active ? "step" : undefined}
              >
                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border
                    ${
                      done
                        ? "border-emerald-200 bg-emerald-50"
                        : active
                          ? "border-[#f26f21]/50 bg-[#fff7f2]"
                          : "border-gray-200 bg-gray-100"
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
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f26f21]" />
                  ) : null}
                </div>
                <span
                  className={
                    done || active
                      ? "text-gray-700"
                      : "text-gray-300"
                  }
                >
                  {s.label}
                </span>
                {done && s.doneLabel && s.doneVariant === "badge" && (
                  <span className="ml-auto rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
                    {s.doneLabel}
                  </span>
                )}
                {done && s.doneLabel && s.doneVariant === "text" && (
                  <span className="ml-auto text-xs text-gray-400">
                    {s.doneLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <details className="mt-5 border-t border-gray-100 pt-4">
          <summary className="w-fit cursor-pointer text-xs font-medium text-[#315d84] underline decoration-[#315d84]/30 underline-offset-4">
            What is happening during generation?
          </summary>
          <div className="mt-3 space-y-3">
            <ol className="space-y-2">
              {steps.map((step, index) => (
                <li key={step.label} className="text-xs leading-relaxed text-gray-600">
                  <span className="font-medium text-gray-800">
                    {index + 1}. {step.label}.
                  </span>{" "}
                  {step.detail ?? "This is part of preparing your result."}
                </li>
              ))}
            </ol>
            <p className="text-xs leading-relaxed text-gray-500">
              {progressNote}
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
