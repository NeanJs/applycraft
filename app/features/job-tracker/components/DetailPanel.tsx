"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Clock, ExternalLink, FileText, Link2, StickyNote, X } from "lucide-react";
import { useMemo, useState } from "react";
import { formatDate, STATUS_META } from "@/app/features/job-tracker/constants";
import { useJobTrackerStore } from "@/app/features/job-tracker/store/useJobTrackerStore";
import type { JobStatus } from "@/app/features/job-tracker/types";

function CompanyInitials({ company }: { company: string | null }) {
  if (!company) return null;
  const initials = company
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-xs font-semibold text-white shadow-sm">
      {initials}
    </div>
  );
}

export function DetailPanel() {
  const selectedJob = useJobTrackerStore((state) => state.selectedJob);
  const selectJob = useJobTrackerStore((state) => state.selectJob);
  const updateJob = useJobTrackerStore((state) => state.updateJob);
  const updateStatus = useJobTrackerStore((state) => state.updateStatus);
  const [statusOpen, setStatusOpen] = useState(false);
  const [notes, setNotes] = useState(selectedJob?.notes ?? "");

  const meta = useMemo(() => (selectedJob ? STATUS_META[selectedJob.status] : null), [selectedJob]);

  if (!selectedJob) return null;

  const handleNotesBlur = async () => {
    await updateJob(selectedJob.id, { notes });
  };

  return (
    <motion.aside
      key={selectedJob.id}
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 360, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="shrink-0 overflow-hidden border-l border-gray-100 bg-white"
    >
      <div className="h-full w-[360px] overflow-y-auto p-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <CompanyInitials company={selectedJob.company} />
            <div>
              <h2 className="text-base font-semibold leading-tight text-gray-900">{selectedJob.company ?? "Untitled company"}</h2>
              <p className="text-sm text-gray-500">{selectedJob.role ?? "Role pending"}</p>
            </div>
          </div>
          <button onClick={() => selectJob(null)} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <div className="relative">
            <button onClick={() => setStatusOpen((value) => !value)} className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-opacity ${meta?.color} ${meta?.bg} ${meta?.border} hover:opacity-80`}>
              <span className={`h-1.5 w-1.5 rounded-full ${meta?.dot}`} />
              {meta?.label}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
            <AnimatePresence>
              {statusOpen ? (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute left-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                  {Object.entries(STATUS_META).map(([key, value]) => (
                    <button key={key} onClick={() => { void updateStatus(selectedJob.id, key as JobStatus); setStatusOpen(false); }} className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-gray-50 ${selectedJob.status === key ? "font-semibold" : ""}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${value.dot}`} />
                      <span className={value.color}>{value.label}</span>
                    </button>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto pr-1">
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              <Clock className="h-3 w-3" /> Added
            </p>
            <p className="text-sm text-gray-700">{formatDate(selectedJob.createdAt)}</p>
          </div>

          {selectedJob.jobUrl ? (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                <Link2 className="h-3 w-3" /> Posting
              </p>
              <a href={selectedJob.jobUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-indigo-600 transition-colors hover:text-indigo-700 hover:underline">
                View job posting
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ) : null}

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              <StickyNote className="h-3 w-3" /> Notes
            </p>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} onBlur={handleNotesBlur} placeholder="Add your notes, next steps, contacts…" className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-300 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200" rows={5} />
          </div>

          {selectedJob.jobDescription ? (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                <FileText className="h-3 w-3" /> Job Description
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{selectedJob.jobDescription}</p>
            </div>
          ) : null}

          {selectedJob.resumeVersion ? (
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Linked Resume</p>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-800">
                <FileText className="h-3.5 w-3.5 text-gray-500" />
                {selectedJob.resumeVersion.title ?? "Generated resume"}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </motion.aside>
  );
}
