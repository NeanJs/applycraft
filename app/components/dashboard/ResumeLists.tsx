"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

interface ResumeProps {
  id: string;
  title: string | null;
  updatedAt: Date;
}

export default function ResumeList({
  resumes: initial,
}: {
  resumes: ResumeProps[];
}) {
  const [resumes, setResumes] = useState(initial);

  async function handleDelete(id: string) {
    if (!confirm("Delete this resume?")) return;

    const res = await fetch("/api/resume/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId: id }),
    });

    if (res.ok) {
      setResumes((prev) => prev.filter((r) => r.id !== id));
      toast.success("Resume deleted.");
    } else {
      toast.error("Could not delete resume. Please try again.");
    }
  }
  return (
    <div className="grid gap-3">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          className="group border border-gray-200 rounded-xl px-6 py-5 flex items-center justify-between hover:border-gray-400 hover:bg-gray-50 transition-all"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-300 group-hover:text-gray-500 group-hover:border-gray-300 transition-colors shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {resume.title || "Untitled Resume"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Updated {formatDate(resume.updatedAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4 shrink-0">
            <Link
              href={`/resume/${resume.id}`}
              className="text-xs font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
              Open →
            </Link>
            <button
              onClick={() => handleDelete(resume.id)}
              className="text-xs font-medium text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
