// features/job-tracker/store/useJobTrackerStore.ts

import { create } from "zustand";

export type JobStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED";

export interface ResumeVersion {
  id: string;
  title: string;
}

export interface JobApplication {
  id: string;

  company?: string;
  role?: string;

  jobUrl?: string;
  jobDescription?: string;

  status: JobStatus;

  resumeVersionId?: string;
  resumeVersion?: ResumeVersion;

  notes?: string;

  createdAt: string;
  updatedAt: string;
  appliedAt?: string;
}

export interface CreateJobInput {
  company?: string;
  role?: string;
  jobUrl?: string;
  jobDescription?: string;
  status: JobStatus;
  resumeVersionId?: string;
  notes?: string;
  appliedAt?: string;
}

interface JobTrackerStore {
  // State
  jobs: JobApplication[];
  selectedJob: JobApplication | null;

  loading: boolean;
  search: string;

  isDialogOpen: boolean;

  // UI Actions
  setSearch: (value: string) => void;

  openDialog: () => void;
  closeDialog: () => void;

  selectJob: (job: JobApplication | null) => void;

  // CRUD
  fetchJobs: () => Promise<void>;

  createJob: (data: CreateJobInput) => Promise<void>;

  updateJob: (id: string, data: Partial<CreateJobInput>) => Promise<void>;

  deleteJob: (id: string) => Promise<void>;

  updateStatus: (id: string, status: JobStatus) => Promise<void>;
}

export const useJobTrackerStore = create<JobTrackerStore>((set, get) => ({
  // -------------------
  // Initial State
  // -------------------

  jobs: [],
  selectedJob: null,

  loading: false,
  search: "",

  isDialogOpen: false,

  // -------------------
  // UI
  // -------------------

  setSearch: (value) => set({ search: value }),

  openDialog: () => set({ isDialogOpen: true }),

  closeDialog: () => set({ isDialogOpen: false }),

  selectJob: (job) => set({ selectedJob: job }),

  // -------------------
  // Fetch
  // -------------------

  fetchJobs: async () => {
    try {
      set({ loading: true });

      const res = await fetch("/api/jobs");

      if (!res.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const jobs: JobApplication[] = await res.json();

      set({
        jobs,
        loading: false,
      });
    } catch (error) {
      console.error(error);

      set({
        loading: false,
      });
    }
  },

  // -------------------
  // Create
  // -------------------

  createJob: async (data) => {
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create job");
      }

      const newJob: JobApplication = await res.json();

      set((state) => ({
        jobs: [newJob, ...state.jobs],
        isDialogOpen: false,
      }));
    } catch (error) {
      console.error(error);
    }
  },

  // -------------------
  // Update
  // -------------------

  updateJob: async (id, data) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to update job");
      }

      const updatedJob: JobApplication = await res.json();

      set((state) => ({
        jobs: state.jobs.map((job) => (job.id === id ? updatedJob : job)),
        selectedJob:
          state.selectedJob?.id === id ? updatedJob : state.selectedJob,
      }));
    } catch (error) {
      console.error(error);
    }
  },

  // -------------------
  // Delete
  // -------------------

  deleteJob: async (id) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete job");
      }

      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
        selectedJob: state.selectedJob?.id === id ? null : state.selectedJob,
      }));
    } catch (error) {
      console.error(error);
    }
  },

  // -------------------
  // Status
  // -------------------

  updateStatus: async (id, status) => {
    try {
      const res = await fetch(`/api/jobs/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      const updatedJob: JobApplication = await res.json();

      set((state) => ({
        jobs: state.jobs.map((job) => (job.id === id ? updatedJob : job)),
        selectedJob:
          state.selectedJob?.id === id ? updatedJob : state.selectedJob,
      }));
    } catch (error) {
      console.error(error);
    }
  },
}));
