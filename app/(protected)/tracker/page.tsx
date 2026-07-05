"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { JobTrackerView } from "@/app/features/job-tracker/components/JobTrackerView";
import { useJobTrackerStore } from "@/app/features/job-tracker/store/useJobTrackerStore";

export default function TrackerPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const jobs = useJobTrackerStore((state) => state.jobs);
  const loading = useJobTrackerStore((state) => state.loading);
  const fetchJobs = useJobTrackerStore((state) => state.fetchJobs);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
      return;
    }

    if (!isSignedIn) return;

    const timer = window.setTimeout(() => {
      void fetchJobs();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchJobs, isLoaded, isSignedIn, router]);

  if (!isLoaded || loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-gray-500">
        Loading tracker…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
            Job tracker
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Keep your applications moving.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Track every role you&apos;re pursuing, save tool outputs to a job
            card, and keep the next step in view.
          </p>
        </div>
        <Link href="/" className="text-sm text-gray-600">
          ← Back home
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">No jobs yet</h2>
          <p className="mt-2 text-sm text-gray-500">
            Save a result from any of the AI tools or create your first job card
            from here to start tracking applications.
          </p>
        </div>
      ) : (
        <JobTrackerView />
      )}
    </div>
  );
}
