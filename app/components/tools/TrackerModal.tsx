"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useJobTrackerStore } from "@/app/features/job-tracker/store/useJobTrackerStore";

interface TrackerModalProps {
  open: boolean;
  onClose: () => void;
  resumeId?: string | null;
  generationId?: string | null;
  jobDescription?: string;
  title?: string;
  company?: string;
  role?: string;
}

interface ResumeOption {
  id: string;
  title: string | null;
  updatedAt: string;
}

export default function TrackerModal({
  open,
  onClose,
  resumeId,
  generationId,
  jobDescription,
  title,
  company,
  role,
}: TrackerModalProps) {
  if (!open) return null;

  return (
    <TrackerModalBody
      onClose={onClose}
      resumeId={resumeId}
      generationId={generationId}
      jobDescription={jobDescription}
      title={title}
      company={company}
      role={role}
    />
  );
}

function TrackerModalBody({
  onClose,
  resumeId,
  generationId,
  jobDescription,
  title,
  company,
  role,
}: Omit<TrackerModalProps, "open">) {
  const { isSignedIn } = useUser();
  const jobs = useJobTrackerStore((state) => state.jobs);
  const hasLoaded = useJobTrackerStore((state) => state.hasLoaded);
  const fetchJobs = useJobTrackerStore((state) => state.fetchJobs);
  const [form, setForm] = useState({ company: company ?? "", role: role ?? "", jobUrl: "", jobDescription: jobDescription ?? "", status: "SAVED", resumeVersionId: resumeId ?? "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [resumes, setResumes] = useState<ResumeOption[]>([]);

  useEffect(() => {
    if (!isSignedIn || hasLoaded) return;
    void fetchJobs();
  }, [fetchJobs, hasLoaded, isSignedIn]);

  useEffect(() => {
    if (!isSignedIn) return;

    let cancelled = false;
    async function loadResumes() {
      try {
        const res = await fetch("/api/resume");
        const data = await res.json();
        if (!res.ok || cancelled) return;
        setResumes(data.resumes ?? []);
      } catch {
        if (!cancelled) {
          setResumes([]);
        }
      }
    }

    void loadResumes();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  async function handleCreate() {
    setSaving(true);
    try {
      const res = await fetch("/api/tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: form.company,
          role: form.role,
          jobUrl: form.jobUrl,
          jobDescription: form.jobDescription,
          status: form.status,
          resumeVersionId: form.resumeVersionId,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Unable to create job.");
        return;
      }
      useJobTrackerStore.setState((state) => ({
        jobs: state.jobs.some((job) => job.id === data.job.id) ? state.jobs : [data.job, ...state.jobs],
      }));
      toast.success("Job saved to tracker.");
      onClose();
    } catch {
      toast.error("Unable to create job.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLink(jobId: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/tracker/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          generationId,
          resumeId: form.resumeVersionId,
          title,
          jobDescription: form.jobDescription,
          company: form.company,
          role: form.role,
          jobUrl: form.jobUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Unable to link job.");
        return;
      }
      useJobTrackerStore.setState((state) => {
        const exists = state.jobs.some((job) => job.id === data.job.id);
        return {
          jobs: exists
            ? state.jobs.map((job) => (job.id === data.job.id ? data.job : job))
            : [data.job, ...state.jobs],
        };
      });
      toast.success("Linked to tracker entry.");
      onClose();
    } catch {
      toast.error("Unable to link job.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-70 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Save to tracker</h3>
            <p className="text-sm text-gray-500">Create a new job card or link this result to an existing one.</p>
          </div>
          <button className="text-sm text-gray-400" onClick={onClose}>Close</button>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input aria-label="Company" autoComplete="organization" className="rounded-xl border border-gray-200 px-3 py-2 text-sm" placeholder="Company" value={form.company} onChange={(e) => setForm((prev) => ({...prev, company: e.target.value}))} />
              <input aria-label="Role" autoComplete="organization-title" className="rounded-xl border border-gray-200 px-3 py-2 text-sm" placeholder="Role" value={form.role} onChange={(e) => setForm((prev) => ({...prev, role: e.target.value}))} />
            </div>
            <input aria-label="Job URL" autoComplete="url" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" placeholder="Job URL" value={form.jobUrl} onChange={(e) => setForm((prev) => ({...prev, jobUrl: e.target.value}))} />
            <textarea aria-label="Job description" className="w-full min-h-24 rounded-xl border border-gray-200 px-3 py-2 text-sm" placeholder="Job description" value={form.jobDescription} onChange={(e) => setForm((prev) => ({...prev, jobDescription: e.target.value}))} />
            <textarea aria-label="Notes" className="w-full min-h-20 rounded-xl border border-gray-200 px-3 py-2 text-sm" placeholder="Notes" value={form.notes} onChange={(e) => setForm((prev) => ({...prev, notes: e.target.value}))} />
            <select className="rounded-xl border border-gray-200 px-3 py-2 text-sm" value={form.resumeVersionId} onChange={(e) => setForm((prev) => ({...prev, resumeVersionId: e.target.value}))}>
              <option value="">No resume linked</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {(resume.title ?? "Untitled Resume") + " • " + new Date(resume.updatedAt).toLocaleDateString()}
                </option>
              ))}
            </select>
            <select className="rounded-xl border border-gray-200 px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm((prev) => ({...prev, status: e.target.value}))}>
              <option value="SAVED">Saved</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <button disabled={saving} onClick={handleCreate} className="w-full rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white">{saving ? "Saving…" : "Create job"}</button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-900 mb-3">Existing jobs</p>
            <div className="space-y-2 max-h-72 overflow-auto">
              {jobs.length === 0 && <p className="text-sm text-gray-500">No saved jobs yet.</p>}
              {jobs.map((job) => (
                <button key={job.id} onClick={() => handleLink(job.id)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-700 hover:border-gray-300">
                  <div className="font-medium">{job.company ?? "Untitled"}</div>
                  <div className="text-xs text-gray-500">{job.role ?? "No role"} • {job.status}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
