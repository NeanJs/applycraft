import Link from "next/link";
import ResumeList from "@/app/components/dashboard/ResumeLists";
import { GenerationType } from "@prisma/client";
import ResumeInsights from "./ResumeInsights";

type Resume = {
  id: string;
  title: string;
  updatedAt: Date;
  atsBefore: number;
  atsAfter: number;
  confidenceScore: number | null;
};
type Generation = {
  id: string;
  type: GenerationType;
  title: string | null;
  jobTitle: string | null;
  companyName: string | null;
  createdAt: Date;
};
export default function DashboardUI({
  resumes,
  firstName,
}: {
  resumes: Resume[];
  firstName: string;
  generations: Generation[];
}) {
  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-2">
              Dashboard
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              Good to see you, {firstName}.
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              {resumes.length === 0
                ? "Create your first AI-powered resume and start applying."
                : `You have ${resumes.length} tailored resume${
                    resumes.length > 1 ? "s" : ""
                  } ready.`}
            </p>
          </div>

          <Link
            href="/resume-tailor"
            className="
              bg-zinc-900 
              text-white 
              px-4 
              py-2.5 
              rounded-xl 
              text-sm 
              font-medium
              hover:bg-zinc-700
              transition
              whitespace-nowrap
            "
          >
            + Tailor Resume
          </Link>
        </div>

        {/* Quick Stats */}

        <ResumeInsights resumes={resumes} />
        {/* Resume Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Your resumes</h2>

            {resumes.length > 0 && (
              <span className="text-xs text-zinc-400">
                {resumes.length} total
              </span>
            )}
          </div>

          {resumes.length > 0 ? (
            <ResumeList resumes={resumes} />
          ) : (
            <div
              className="
              bg-white
              border
              border-dashed
              border-zinc-200
              rounded-2xl
              py-20
              flex
              flex-col
              items-center
              justify-center
              text-center
            "
            >
              <div
                className="
                w-12
                h-12
                rounded-xl
                bg-zinc-50
                border
                border-zinc-200
                flex
                items-center
                justify-center
                text-zinc-400
                mb-5
              "
              >
                📄
              </div>

              <p className="text-sm font-medium">No resumes yet</p>

              <p
                className="
                text-sm
                text-zinc-400
                mt-2
                max-w-sm
              "
              >
                Upload your resume, add a job description, and let AI tailor it
                for the role.
              </p>

              <Link
                href="/resume-tailor"
                className="
                  mt-6
                  bg-zinc-900
                  text-white
                  px-5
                  py-2.5
                  rounded-xl
                  text-sm
                  font-medium
                  hover:bg-zinc-700
                  transition
                "
              >
                Create your first resume →
              </Link>
            </div>
          )}
        </section>

        {/* Footer info */}
        {resumes.length > 0 && (
          <p className="text-xs text-zinc-400 text-center mt-10">
            Last updated {formatDate(resumes[0].updatedAt)}
          </p>
        )}
      </main>
    </div>
  );
}
