"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { JobForm } from "@/app/features/job-tracker/components/JobForm";
import { useJobTrackerStore } from "@/app/features/job-tracker/store/useJobTrackerStore";

export function AddJobDialog() {
  const isDialogOpen = useJobTrackerStore((state) => state.isDialogOpen);
  const editingJob = useJobTrackerStore((state) => state.editingJob);
  const closeDialog = useJobTrackerStore((state) => state.closeDialog);

  return (
    <AnimatePresence>
      {isDialogOpen ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{editingJob ? "Edit job" : "Add job"}</h2>
                <p className="text-sm text-gray-500">Create or update a tracker entry using the same fields as the Prisma model.</p>
              </div>
              <button onClick={closeDialog} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <JobForm job={editingJob} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
