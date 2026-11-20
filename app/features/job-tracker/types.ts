export type JobStatus = "SAVED" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

export interface ResumeVersion {
  id: string;
  title?: string | null;
  createdAt?: string;
}

export interface JobApplication {
  id: string;
  company: string | null;
  role: string | null;
  jobUrl: string | null;
  jobDescription: string | null;
  status: JobStatus;
  resumeVersionId: string | null;
  resumeVersion?: ResumeVersion | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  appliedAt?: string | null;
}

export interface CreateJobInput {
  company?: string | null;
  role?: string | null;
  jobUrl?: string | null;
  jobDescription?: string | null;
  status: JobStatus;
  resumeVersionId?: string | null;
  notes?: string | null;
  appliedAt?: string | null;
}
