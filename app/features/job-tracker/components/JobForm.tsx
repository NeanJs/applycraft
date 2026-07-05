"use client";

import { useEffect, useMemo, useState } from "react";
import { useJobTrackerStore } from "@/app/features/job-tracker/store/useJobTrackerStore";
import type { CreateJobInput, JobApplication, JobStatus } from "@/app/features/job-tracker/types";

interface JobFormProps {
  job?: JobApplication | null;
  onSubmit?: () => void;
}

interface ResumeOption {
  id: string;
  title: string | null;
  updatedAt: string;
}

const DEFAULT_FORM: CreateJobInput = {
  company: "",
  role: "",
  jobUrl: "",
  jobDescription: "",
  notes: "",
  status: "SAVED",
  appliedAt: undefined,
};

export function JobForm({ job, onSubmit }: JobFormProps) {
  const createJob = useJobTrackerStore((state) => state.createJob);
  const updateJob = useJobTrackerStore((state) => state.updateJob);
  const closeDialog = useJobTrackerStore((state) => state.closeDialog);
  const initialForm = useMemo<CreateJobInput>(() => {
    if (!job) return DEFAULT_FORM;

    return {
      company: job.company ?? "",
      role: job.role ?? "",
      jobUrl: job.jobUrl ?? "",
      jobDescription: job.jobDescription ?? "",
      notes: job.notes ?? "",
      status: job.status,
      resumeVersionId: job.resumeVersionId ?? undefined,
      appliedAt: job.appliedAt ?? undefined,
    };
  }, [job]);
  const [form, setForm] = useState<CreateJobInput>(initialForm);
  const [resumes, setResumes] = useState<ResumeOption[]>([]);

  useEffect(() => {
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
  }, []);

  const handleFormReset = () => setForm(initialForm);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload: CreateJobInput = {
      ...form,
      company: form.company?.trim() || null,
      role: form.role?.trim() || null,
      jobUrl: form.jobUrl?.trim() || null,
      jobDescription: form.jobDescription?.trim() || null,
      notes: form.notes?.trim() || null,
      resumeVersionId: form.resumeVersionId?.trim() || null,
      appliedAt: form.appliedAt?.trim() || null,
    };

    if (job) {
      await updateJob(job.id, payload);
    } else {
      await createJob(payload);
    }

    handleFormReset();
    onSubmit?.();
    closeDialog();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-gray-700">
          <span className="font-medium">Company</span>
          <input autoComplete="organization" value={form.company ?? ""} onChange={(event) => setForm((value) => ({ ...value, company: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" placeholder="Acme" />
        </label>
        <label className="space-y-2 text-sm text-gray-700">
          <span className="font-medium">Role</span>
          <input autoComplete="organization-title" value={form.role ?? ""} onChange={(event) => setForm((value) => ({ ...value, role: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" placeholder="Product Engineer" />
        </label>
      </div>

      <label className="space-y-2 text-sm text-gray-700">
        <span className="font-medium">Job URL</span>
        <input autoComplete="url" value={form.jobUrl ?? ""} onChange={(event) => setForm((value) => ({ ...value, jobUrl: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" placeholder="https://example.com/careers" />
      </label>

      <label className="space-y-2 text-sm text-gray-700">
        <span className="font-medium">Job description</span>
        <textarea value={form.jobDescription ?? ""} onChange={(event) => setForm((value) => ({ ...value, jobDescription: event.target.value }))} className="min-h-24 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" placeholder="Paste the job posting here" />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-gray-700">
          <span className="font-medium">Status</span>
          <select value={form.status} onChange={(event) => setForm((value) => ({ ...value, status: event.target.value as JobStatus }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm">
            <option value="SAVED">SAVED</option>
            <option value="APPLIED">APPLIED</option>
            <option value="INTERVIEW">INTERVIEW</option>
            <option value="OFFER">OFFER</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-gray-700">
          <span className="font-medium">Applied at</span>
          <input type="date" value={form.appliedAt ?? ""} onChange={(event) => setForm((value) => ({ ...value, appliedAt: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        </label>
      </div>

      <label className="space-y-2 text-sm text-gray-700">
        <span className="font-medium">Linked resume</span>
        <select
          value={form.resumeVersionId ?? ""}
          onChange={(event) =>
            setForm((value) => ({
              ...value,
              resumeVersionId: event.target.value || null,
            }))
          }
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="">No resume linked</option>
          {resumes.map((resume) => (
            <option key={resume.id} value={resume.id}>
              {(resume.title ?? "Untitled Resume") + " • " + new Date(resume.updatedAt).toLocaleDateString()}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-sm text-gray-700">
        <span className="font-medium">Notes</span>
        <textarea value={form.notes ?? ""} onChange={(event) => setForm((value) => ({ ...value, notes: event.target.value }))} className="min-h-24 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" placeholder="Add notes" />
      </label>

      <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
        <button type="button" onClick={closeDialog} className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600">Cancel</button>
        <button type="submit" className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white">Save</button>
      </div>
    </form>
  );
}
