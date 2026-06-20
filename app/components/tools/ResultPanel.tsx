"use client";

import React from "react";
import JobMetadata from "../JobMeta";

interface ResultPanelProps {
  children: React.ReactNode;
  /** Optional footer shown below the result (e.g. "Optimize again" hint + back link) */
  footer?: React.ReactNode;
  job?:
    | {
        jobTitle?: string;
        companyName?: string;
      }
    | undefined;
}

/**
 * Generic wrapper that renders any tool result with consistent spacing.
 * Pass your tool-specific result UI as children.
 */
export default function ResultPanel({
  children,
  job,
  footer,
}: ResultPanelProps) {
  return (
    <>
      {job && (
        <JobMetadata jobTitle={job.jobTitle} companyName={job.companyName} />
      )}
      <div className="mt-6">{children}</div>
      {footer && (
        <div className="mt-6 flex items-center justify-between">{footer}</div>
      )}
    </>
  );
}
