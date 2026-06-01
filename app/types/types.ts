interface WorkExperience {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary: string;
  skills: { category: string; items: string[] }[];
  experience: WorkExperience[];
  education: Education[];
  projects?: Project[];
  certifications?: string[];
}

interface ResponseData {
  jobType: string;
  atsScore: number;
  optimizedResume: ResumeData;
  missingKeywords: string[];
  coverLetter: string;
}
export type { ResponseData, ResumeData };
