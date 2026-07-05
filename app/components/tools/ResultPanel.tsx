"use client";

import React from "react";
import JobMetadata from "./JobMeta";
import TrackerAction from "./TrackerAction";

interface ResultPanelProps {
  children: React.ReactNode;
  /** Optional footer shown below the result (e.g. "Optimize again" hint + back link) */
  footer?: React.ReactNode;
  trackerProps?: {
    resumeId?: string | null;
    generationId?: string | null;
    jobDescription?: string;
    title?: string;
    company?: string;
    role?: string;
  };
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
  trackerProps,
}: ResultPanelProps) {
  return (
    <>
      {job && (
        <JobMetadata jobTitle={job.jobTitle} companyName={job.companyName} />
      )}
      <div className="mt-6">{children}</div>
      {trackerProps && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <TrackerAction {...trackerProps} />
        </div>
      )}
      {footer && (
        <div className="mt-6 flex items-center justify-between">{footer}</div>
      )}
    </>
  );
}
