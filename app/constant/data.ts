import { ResponseData, ResumeData } from "../types/types";

export const SampleResumeData: ResumeData = {
  name: "Nijan Adhikari",
  title: "Senior Software Engineer",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 012-3456",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/alexjohnson",
  github: "github.com/alexjohnson",
  website: "alexjohnson.dev",
  summary:
    "Results-driven Software Engineer with 6+ years of experience building scalable web applications. Proven track record of reducing load times by 40% and shipping features that serve millions of users. Proficient in TypeScript, React, and Node.js with strong expertise in cloud infrastructure and CI/CD pipelines.",
  skills: [
    {
      category: "Languages",
      items: ["TypeScript", "JavaScript", "Python", "Go", "SQL"],
    },
    {
      category: "Frontend",
      items: ["React", "Next.js", "Tailwind CSS", "GraphQL", "Redux"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "PostgreSQL", "Redis", "REST APIs"],
    },
    {
      category: "DevOps & Cloud",
      items: ["AWS", "Docker", "Kubernetes", "GitHub Actions", "Terraform"],
    },
  ],
  experience: [
    {
      company: "Acme Technologies",
      title: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2022",
      endDate: "Present",
      bullets: [
        "Architected and led migration of monolithic Rails app to microservices on AWS EKS, reducing deployment time by 65% and improving uptime to 99.98%.",
        "Built a real-time dashboard using React and WebSockets serving 50,000+ daily active users, improving data visibility for the operations team.",
        "Mentored 4 junior engineers through code reviews, pair programming, and bi-weekly 1:1s, contributing to a 30% reduction in production bugs.",
        "Collaborated with product and design to ship 12 major features on schedule across 3 quarters.",
      ],
    },
    {
      company: "Brightloop Inc.",
      title: "Software Engineer",
      location: "Remote",
      startDate: "Mar 2020",
      endDate: "Dec 2021",
      bullets: [
        "Developed and maintained a GraphQL API layer consumed by 3 client applications, reducing average query time by 45% through batching and caching.",
        "Implemented automated end-to-end testing suite using Playwright, achieving 85% code coverage and cutting QA cycle time in half.",
        "Contributed to open-source tooling that accumulated 1,200+ GitHub stars within 6 months of release.",
      ],
    },
    {
      company: "DevStudio Labs",
      title: "Junior Software Engineer",
      location: "Austin, TX",
      startDate: "Jun 2018",
      endDate: "Feb 2020",
      bullets: [
        "Built reusable React component library adopted across 5 internal products, accelerating feature development by an estimated 20%.",
        "Integrated third-party payment API (Stripe) handling $2M+ in monthly transactions with 99.9% success rate.",
      ],
    },
  ],
  education: [
    {
      institution: "University of Texas at Austin",
      degree: "Bachelor of Science",
      field: "Computer Science",
      graduationDate: "May 2018",
      gpa: "3.7/4.0",
      honors: "Magna Cum Laude",
    },
  ],
  projects: [
    {
      name: "OpenTrack",
      description:
        "Open-source project management CLI tool with AI-powered task prioritization.",
      technologies: ["Go", "OpenAI API", "SQLite"],
      link: "github.com/alexjohnson/opentrack",
    },
    {
      name: "Portfol.io",
      description:
        "SaaS platform for developers to generate and host portfolios from GitHub data.",
      technologies: ["Next.js", "Supabase", "Vercel"],
      link: "portfol.io",
    },
  ],
  certifications: [
    "AWS Certified Solutions Architect – Associate (2023)",
    "Google Professional Cloud Developer (2022)",
  ],
};

export const SampleData: ResponseData = {
  jobType: "Technical leadership role",
  atsScore: 87,
  optimizedResume: SampleResumeData,
  missingKeywords: [
    "Stakeholder Management",
    "System Architecture",
    "CI/CD",
    "Microservices",
    "Kubernetes",
    "Cross-functional Leadership",
    "Strategic Planning",
  ],
  coverLetter:
    "Dear Hiring Manager,\n\nI am excited to apply for the Technical Leadership position at your organization. With over five years of experience designing and delivering scalable web applications, I have developed a strong foundation in software engineering, team collaboration, and project execution.\n\nIn my current role as a Senior Full Stack Developer, I lead the development of customer-facing platforms used by thousands of users while collaborating closely with product and business stakeholders. My experience spans frontend and backend development, cloud infrastructure, performance optimization, and mentoring team members.\n\nI am particularly drawn to this opportunity because it combines technical excellence with leadership and strategic impact. I am confident that my background in building scalable systems and driving successful project outcomes would allow me to contribute meaningfully to your team.\n\nThank you for your time and consideration. I look forward to the opportunity to discuss how my experience aligns with your organization's goals.\n\nSincerely,\nJohn Doe",
};


