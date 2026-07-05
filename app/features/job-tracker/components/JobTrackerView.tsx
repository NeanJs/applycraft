"use client";

import { AnimatePresence } from "motion/react";
import { AddJobDialog } from "@/app/features/job-tracker/components/AddJobDialog";
import { DetailPanel } from "@/app/features/job-tracker/components/DetailPanel";
import { Header } from "@/app/features/job-tracker/components/Header";
import { KanbanBoard } from "@/app/features/job-tracker/components/KanbanBoard";
import { StatsBar } from "@/app/features/job-tracker/components/StatsBar";
import { useJobTrackerStore } from "@/app/features/job-tracker/store/useJobTrackerStore";

export function JobTrackerView() {
  const selectedJob = useJobTrackerStore((state) => state.selectedJob);

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f9]">
      <Header />
      <div className="border-b border-gray-100 bg-white px-6 py-3">
        <StatsBar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <KanbanBoard />
        </div>
        <AnimatePresence>{selectedJob ? <DetailPanel /> : null}</AnimatePresence>
      </div>

      <AddJobDialog />
    </div>
  );
}
