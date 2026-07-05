"use client";

import { useMemo } from "react";
import { KanbanColumn } from "@/app/features/job-tracker/components/KanbanColumn";
import { STATUS_ORDER } from "@/app/features/job-tracker/constants";
import { useJobTrackerStore } from "@/app/features/job-tracker/store/useJobTrackerStore";

export function KanbanBoard() {
  const jobs = useJobTrackerStore((state) => state.jobs);
  const search = useJobTrackerStore((state) => state.search);

  const filteredJobs = useMemo(() => {
    if (!search.trim()) return jobs;

    const value = search.toLowerCase();
    return jobs.filter((job) => {
      const company = job.company?.toLowerCase() ?? "";
      const role = job.role?.toLowerCase() ?? "";
      return company.includes(value) || role.includes(value);
    });
  }, [jobs, search]);

  return (
    <div className="flex h-full gap-4 p-6" style={{ minWidth: "max-content" }}>
      {STATUS_ORDER.map((status) => (
        <KanbanColumn key={status} status={status} jobs={filteredJobs.filter((job) => job.status === status)} />
      ))}
    </div>
  );
}
