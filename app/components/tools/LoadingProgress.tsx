"use client";

export interface LoadingStep {
  label: string;
  doneLabel?: string; // optional badge/text shown when done, e.g. "detected" or "scored"
  doneVariant?: "badge" | "text"; // "badge" = pill, "text" = plain xs text
}

interface LoadingProgressProps {
  steps: LoadingStep[];
  currentStep: number;
  title?: string;
  eta?: string;
}

export default function LoadingProgress({
  steps,
  currentStep,
  title = "Generating your results",
  eta = "~30 seconds",
}: LoadingProgressProps) {
  return (
    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-400">{eta}</p>
      </div>
      <div className="flex flex-col gap-3">
        {steps.map((s, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={s.label} className="flex items-center gap-3 text-sm">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border
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
              {done && s.doneLabel && s.doneVariant === "badge" && (
                <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
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
    </div>
  );
}
