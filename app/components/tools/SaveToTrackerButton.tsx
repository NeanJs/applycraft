"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { track } from "@vercel/analytics/react";
import toast from "react-hot-toast";
import { useJobTrackerStore } from "@/app/features/job-tracker/store/useJobTrackerStore";

interface SaveToTrackerButtonProps {
  resumeId?: string | null;
  generationId?: string | null;
  jobDescription?: string;
  title?: string;
  company?: string;
  role?: string;
}

export default function SaveToTrackerButton({
  resumeId,
  generationId,
  jobDescription,
  title,
  company,
  role,
}: SaveToTrackerButtonProps) {
  const { isSignedIn } = useUser();
  const jobs = useJobTrackerStore((state) => state.jobs);
  const hasLoaded = useJobTrackerStore((state) => state.hasLoaded);
  const fetchJobs = useJobTrackerStore((state) => state.fetchJobs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn || hasLoaded) return;
    void fetchJobs();
  }, [fetchJobs, hasLoaded, isSignedIn]);

  async function handleSave() {
    if (!isSignedIn) {
      toast.error("Please sign in to save to your tracker.");
      return;
    }

    setLoading(true);
    track("save_to_tracker_clicked", { source: title ?? "tool_result" });

    try {
      const res = await fetch("/api/tracker/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationId,
          jobDescription,
          resumeId,
          title,
          company,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Unable to save to tracker.");
        return;
      }
      useJobTrackerStore.setState((state) => ({
        jobs: state.jobs.some((job) => job.id === data.job.id) ? state.jobs : [data.job, ...state.jobs],
      }));
      toast.success("Saved to your job tracker.");
    } catch {
      toast.error("Unable to save to tracker.");
    } finally {
      setLoading(false);
    }
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSave}
        disabled={loading}
        className="text-xs font-medium text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors"
      >
        {loading ? "Saving…" : "Save to tracker"}
      </button>
      {jobs.length > 0 && (
        <span className="text-[11px] text-gray-400">{jobs[0].company ?? jobs[0].role ?? "Saved"}</span>
      )}
    </div>
  );
}
