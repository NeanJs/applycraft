import { create } from "zustand";
import toast from "react-hot-toast";
import type { CreateJobInput, JobApplication, JobStatus } from "@/app/features/job-tracker/types";

interface JobTrackerStore {
  jobs: JobApplication[];
  selectedJob: JobApplication | null;
  search: string;
  loading: boolean;
  hasLoaded: boolean;
  isDialogOpen: boolean;
  editingJob: JobApplication | null;
  setSearch: (value: string) => void;
  openDialog: (job?: JobApplication | null) => void;
  closeDialog: () => void;
  selectJob: (job: JobApplication | null) => void;
  fetchJobs: () => Promise<void>;
  createJob: (data: CreateJobInput) => Promise<void>;
  updateJob: (id: string, data: Partial<CreateJobInput>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  updateStatus: (id: string, status: JobStatus) => Promise<void>;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return fallback;
}

export const useJobTrackerStore = create<JobTrackerStore>((set, get) => ({
  jobs: [],
  selectedJob: null,
  search: "",
  loading: false,
  hasLoaded: false,
  isDialogOpen: false,
  editingJob: null,

  setSearch: (value) => set({ search: value }),

  openDialog: (job = null) => set({ isDialogOpen: true, editingJob: job }),
  closeDialog: () => set({ isDialogOpen: false, editingJob: null }),

  selectJob: (job) => set({ selectedJob: job }),

  fetchJobs: async () => {
    const state = get();
    if (state.loading || state.hasLoaded) return;

    set({ loading: true });
    try {
      const res = await fetch("/api/tracker");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Failed to load jobs");

      set({ jobs: data.jobs ?? [], loading: false, hasLoaded: true });
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Unable to load tracker jobs."));
      set({ loading: false });
    }
  },

  createJob: async (data) => {
    try {
      const res = await fetch("/api/tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Failed to create job");

      set((state) => ({
        jobs: [payload.job, ...state.jobs],
        selectedJob: state.selectedJob ?? payload.job,
        isDialogOpen: false,
        editingJob: null,
      }));
      toast.success("Job created.");
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Unable to create job."));
    }
  },

  updateJob: async (id, data) => {
    try {
      const res = await fetch("/api/tracker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Failed to update job");

      set((state) => ({
        jobs: state.jobs.map((job) => (job.id === id ? payload.job : job)),
        selectedJob: state.selectedJob?.id === id ? payload.job : state.selectedJob,
        isDialogOpen: false,
        editingJob: null,
      }));
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Unable to update job."));
    }
  },

  deleteJob: async (id) => {
    try {
      const res = await fetch(`/api/tracker?id=${id}`, {
        method: "DELETE",
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Failed to delete job");

      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
        selectedJob: state.selectedJob?.id === id ? null : state.selectedJob,
      }));
      toast.success("Job removed.");
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Unable to delete job."));
    }
  },

  updateStatus: async (id, status) => {
    try {
      const res = await fetch("/api/tracker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Failed to update status");

      set((state) => ({
        jobs: state.jobs.map((job) => (job.id === id ? payload.job : job)),
        selectedJob: state.selectedJob?.id === id ? payload.job : state.selectedJob,
      }));
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Unable to update status."));
    }
  },
}));
