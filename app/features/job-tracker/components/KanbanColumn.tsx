"use client";

import { AnimatePresence } from "motion/react";
import { JobCard } from "@/app/features/job-tracker/components/JobCard";
import { STATUS_META } from "@/app/features/job-tracker/constants";
import type { JobApplication, JobStatus } from "@/app/features/job-tracker/types";

interface KanbanColumnProps {
  status: JobStatus;
  jobs: JobApplication[];
}

export function KanbanColumn({ status, jobs }: KanbanColumnProps) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <div className="flex min-w-[220px] flex-1 flex-col">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`${meta.color} ${meta.bg} rounded-lg p-1`}>
            <Icon className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-semibold text-gray-700">{meta.label}</span>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.bg} ${meta.color}`}>{jobs.length}</span>
      </div>
      <div className={`min-h-[120px] flex-1 space-y-2 rounded-2xl border-2 border-dashed p-2 ${meta.border}`}>
        <AnimatePresence>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </AnimatePresence>
        {jobs.length === 0 ? (
          <div className="flex h-full items-center justify-center py-8">
            <p className="text-center text-[11px] text-gray-300">No jobs here yet</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
