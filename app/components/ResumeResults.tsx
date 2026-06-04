"use client";

import ResumePreview from "@/app/components/ResumePreview";
import MissingKeywords from "@/app/components/MissingKeywords";
import CoverLetter from "@/app/components/CoverLetter";
import { handleDownload } from "@/app/services/download";
import { ResponseData, ResumeData } from "@/app/types/types";
import { useState } from "react";

export default function ResumeResults({
  result,
  copied,
}: {
  result: ResponseData;
  copied: boolean;
}) {
  const [localCopied, setLocalCopied] = useState(false);

  const handleCopy = (data: ResumeData) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setLocalCopied(true);
    setTimeout(() => setLocalCopied(false), 2000);
  };

  const isCopied = copied || localCopied;

  const score = result.atsScore;

  const scoreColor =
    score >= 80
      ? "text-emerald-600"
      : score >= 60
        ? "text-amber-500"
        : "text-red-500";

  const scoreBadgeBg =
    score >= 80
      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
      : score >= 60
        ? "bg-amber-50 border-amber-200 text-amber-700"
        : "bg-red-50 border-red-200 text-red-700";

  const scoreBarColor =
    score >= 80
      ? "bg-emerald-500"
      : score >= 60
        ? "bg-amber-400"
        : "bg-red-400";

  const scoreHint =
    score >= 80
      ? "Strong match — ready to apply."
      : score >= 60
        ? "Decent match — consider adding missing keywords."
        : "Low match — review keywords below.";

  const scoreLabel = score >= 80 ? "Excellent" : score >= 60 ? "Fair" : "Low";

  return (
    <div className="mt-10 flex flex-col border border-gray-200 rounded-2xl overflow-hidden">
      {/* ATS Score */}
      <section className="px-8 py-7 border-b border-gray-200 bg-white">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-5">
          ATS Match Score
        </p>
        <div className="flex items-end gap-6">
          <span
            className={`text-6xl font-semibold leading-none tabular-nums ${scoreColor}`}
          >
            {score}%
          </span>
          <div className="flex flex-col gap-2 flex-1 pb-1">
            {/* Progress bar */}
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${scoreBarColor}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{scoreHint}</p>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full border ${scoreBadgeBg}`}
              >
                {scoreLabel}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Optimized Resume */}
      <section className="px-8 py-7 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-0.5">
              Output
            </p>
            <h2 className="text-sm font-semibold text-gray-900">
              Optimized Resume
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(result.optimizedResume)}
              className="text-xs font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
              {isCopied ? "Copied ✓" : "Copy JSON"}
            </button>
            <button
              onClick={() => handleDownload(result.optimizedResume)}
              className="text-xs font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
              Download .txt
            </button>
          </div>
        </div>
        <div className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
          <ResumePreview responseData={result.optimizedResume} />
        </div>
      </section>

      {/* Missing Keywords */}
      <section className="px-8 py-7 border-b border-gray-200">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-0.5">
          Gaps
        </p>
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Missing Keywords
        </h2>
        <MissingKeywords list={result.missingKeywords} />
      </section>

      {/* Cover Letter */}
      <section className="px-8 py-7 bg-gray-50/50">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-0.5">
          Generated
        </p>
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Cover Letter
        </h2>
        <CoverLetter text={result.coverLetter} />
      </section>
    </div>
  );
}
