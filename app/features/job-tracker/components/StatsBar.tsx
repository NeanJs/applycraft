"use client";

import { Briefcase } from "lucide-react";
import { useJobTrackerStore } from "@/app/features/job-tracker/store/useJobTrackerStore";

export function StatsBar() {
  const jobs = useJobTrackerStore((state) => state.jobs);

  const total = jobs.length;
  const offers = jobs.filter((job) => job.status === "OFFER").length;
  const interviews = jobs.filter((job) => job.status === "INTERVIEW").length;
  const applied = jobs.filter((job) => job.status === "APPLIED").length;

  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="flex items-center gap-1.5 text-gray-500">
        <Briefcase className="h-4 w-4" />
        <span className="font-semibold text-gray-900">{total}</span>
        <span>total</span>
      </div>
      <div className="h-4 w-px bg-gray-200" />
      <div className="flex items-center gap-1.5 text-gray-500">
        <span className="h-2 w-2 rounded-full bg-blue-400" />
        <span className="font-semibold text-gray-900">{applied}</span>
        <span>applied</span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-500">
        <span className="h-2 w-2 rounded-full bg-violet-400" />
        <span className="font-semibold text-gray-900">{interviews}</span>
        <span>interviewing</span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-500">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="font-semibold text-gray-900">{offers}</span>
        <span>offers</span>
      </div>
    </div>
  );
}
