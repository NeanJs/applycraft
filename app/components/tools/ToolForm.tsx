"use client";

import React from "react";

interface ToolFormProps {
  /** The two (or more) input panels, side by side on sm+ */
  inputs: React.ReactNode[];
  /** The generate / submit button */
  cta: React.ReactNode;
  /** Optional trust tips row shown below the CTA when idle */
  tips?: React.ReactNode;
  /** Loading progress UI */
  loadingProgress?: React.ReactNode;
  /** Result panel */
  result?: React.ReactNode;
}

/**
 * Lays out the standard two-column input grid + CTA + tips + loading + result.
 * All inputs are passed as an array so the grid stays consistent regardless
 * of how many fields each tool needs.
 */
export default function ToolForm({
  inputs,
  cta,
  tips,
  loadingProgress,
  result,
}: ToolFormProps) {
  return (
    <>
      {/* Input grid, 1 col on mobile, 2 col on sm+ */}
      <div
        className={`grid grid-cols-1 ${inputs.length > 1 ? "sm:grid-cols-2" : ""} gap-3 mb-3`}
      >
        {inputs.map((input, i) => (
          <React.Fragment key={i}>{input}</React.Fragment>
        ))}
      </div>

      {/* CTA button */}
      {cta}

      {/* Trust tips (idle state) */}
      {tips && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {tips}
        </div>
      )}

      {/* Loading progress */}
      {loadingProgress}

      {/* Results */}
      {result}
    </>
  );
}
