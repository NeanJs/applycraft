"use client";

import { useState } from "react";

type SummaryKey = "conservative" | "balanced" | "impact";

interface SummaryCardProps {
  summaries: {
    conservative: string;
    balanced: string;
    impact: string;
  };
}

const labels: Record<SummaryKey, string> = {
  conservative: "Conservative",
  balanced: "Balanced",
  impact: "Impact",
};

export default function SummaryCard({ summaries }: SummaryCardProps) {
  const [active, setActive] = useState<SummaryKey>("balanced");
  const [copied, setCopied] = useState(false);

  const currentSummary = summaries[active];

  function copySummary() {
    navigator.clipboard.writeText(currentSummary).then(() => {
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  }

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
          Resume Summary
        </span>

        <button
          onClick={copySummary}
          className={`text-[11px] font-medium px-3 py-1.5 rounded-lg border transition
          ${
            copied
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
          }`}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Version selector */}
      <div className="px-5 pt-4 flex gap-2">
        {(Object.keys(labels) as SummaryKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-3 py-1.5 rounded-lg text-xs border transition
            ${
              active === key
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {labels[key]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-5 py-5">
        <p className="text-sm text-gray-700 leading-relaxed">
          {currentSummary}
        </p>
      </div>
    </div>
  );
}
