"use client";

import { motion } from "motion/react";
import { CalendarDays, Star } from "lucide-react";
import { getAccentHue, getInitials, formatDate } from "@/app/features/job-tracker/constants";
import { useJobTrackerStore } from "@/app/features/job-tracker/store/useJobTrackerStore";
import type { JobApplication } from "@/app/features/job-tracker/types";

interface JobCardProps {
  job: JobApplication;
}

export function JobCard({ job }: JobCardProps) {
  const selectedJob = useJobTrackerStore((state) => state.selectedJob);
  const selectJob = useJobTrackerStore((state) => state.selectJob);
  const selected = selectedJob?.id === job.id;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => selectJob(job)}
      className={`w-full rounded-2xl border p-3.5 text-left transition-all duration-150 ${selected ? "border-indigo-300 bg-indigo-50 shadow-sm shadow-indigo-100" : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold text-white shadow-sm" style={{ background: `hsl(${getAccentHue(job.company)}, 65%, 52%)` }}>
          {getInitials(job.company)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1">
            <p className="truncate text-sm font-semibold leading-tight text-gray-900">{job.company ?? "Untitled company"}</p>
            {job.notes?.includes("star") ? <Star className="mt-0.5 h-3 w-3 shrink-0 fill-amber-400 text-amber-400" /> : null}
          </div>
          <p className="mt-0.5 truncate text-xs text-gray-500">{job.role ?? "Role pending"}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          <CalendarDays className="h-3 w-3" />
          {formatDate(job.createdAt)}
        </span>
      </div>
    </motion.button>
  );
}
