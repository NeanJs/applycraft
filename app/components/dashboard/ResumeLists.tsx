// components/ResumeList.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { ConfirmDialog } from "../ConfirmDialog";
import { getResumeDisplayTitle } from "@/app/helpers/resumeTitle";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(date));
}

interface ResumeProps {
  id: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  generations: {
    jobTitle: string | null;
    companyName: string | null;
  }[];
}

export default function ResumeList({
  resumes: initial,
}: {
  resumes: ResumeProps[];
}) {
  const [resumes, setResumes] = useState(initial);
  const [pendingDelete, setPendingDelete] = useState<ResumeProps | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pendingDeleteTitle = pendingDelete
    ? getResumeDisplayTitle(pendingDelete.title, pendingDelete.generations[0])
    : "";

  async function confirmDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);

    const res = await fetch("/api/resume/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId: pendingDelete.id }),
    });

    if (res.ok) {
      setResumes((prev) => prev.filter((r) => r.id !== pendingDelete.id));
      toast.success("Resume deleted.");
    } else {
      toast.error("Could not delete resume. Please try again.");
    }

    setIsDeleting(false);
    setPendingDelete(null);
  }

  return (
    <>
      <div className="grid gap-3">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="group border border-gray-200 rounded-xl px-6 py-5 flex items-center justify-between hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-300 group-hover:text-gray-500 group-hover:border-gray-300 transition-colors shrink-0">
                <span>
                  {getResumeDisplayTitle(resume.title, resume.generations[0]).charAt(0)}
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getResumeDisplayTitle(resume.title, resume.generations[0])}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Generated {formatDateTime(resume.createdAt)}
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
                onClick={() => setPendingDelete(resume)}
                className="text-xs font-medium text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete resume?"
        description={`"${pendingDeleteTitle}" will be permanently deleted. This can't be undone.`}
        confirmLabel={isDeleting ? "Deleting…" : "Delete"}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
