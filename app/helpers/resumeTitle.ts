type ResumeJobLabels = {
  jobTitle?: string | null;
  companyName?: string | null;
};

export function getResumeDisplayTitle(
  title: string | null | undefined,
  job?: ResumeJobLabels | null,
): string {
  if (title && !["Resume Optimization", "Untitled Resume"].includes(title)) {
    return title;
  }
  if (job?.jobTitle && job.companyName) {
    return `${job.jobTitle}, ${job.companyName}`;
  }
  if (job?.jobTitle) {
    return `${job.jobTitle} Resume`;
  }
  if (job?.companyName) {
    return `Resume for ${job.companyName}`;
  }
  return title || "Tailored Resume";
}
