"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { getResumeDisplayTitle } from "@/app/helpers/resumeTitle";
import type { GenerationType } from "@prisma/client";

type ActivityItem = {
  id: string;
  type: GenerationType;
  title: string | null;
  jobTitle: string | null;
  companyName: string | null;
  createdAt: Date;
};

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

export default function RecentActivity({
  initialItems,
}: {
  initialItems: ActivityItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  async function clearActivity() {
    setClearing(true);
    try {
      const response = await fetch("/api/generation/clear-activity", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Could not clear recent activity.");
      }

      setItems([]);
      setConfirmOpen(false);
      toast.success("Recent activity cleared. Your saved resumes are unchanged.");
    } catch (error) {
      console.error("Could not clear recent activity:", error);
      toast.error("Could not clear recent activity. Please try again.");
    } finally {
      setClearing(false);
    }
  }

  return (
    <section className="mb-10 rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-900">Recent activity</h2>
        <div className="flex items-center gap-3">
          {items.length > 0 && (
            <>
              <span className="text-xs text-zinc-400">
                {items.length} latest
              </span>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="text-xs font-medium text-red-600 transition hover:text-red-800"
              >
                Clear activity
              </button>
            </>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No recent activity. Your saved resumes are kept separately.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {getResumeDisplayTitle(item.title, item)}
                </p>
                <p className="text-xs text-zinc-500">
                  {item.type.toLowerCase().replaceAll("_", " ")}
                </p>
              </div>
              <span className="text-xs text-zinc-400">
                Generated {formatDateTime(item.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Clear recent activity?"
        description="This removes your generation activity history. Your saved resumes and job applications will not be deleted."
        confirmLabel={clearing ? "Clearing…" : "Clear activity"}
        onConfirm={() => void clearActivity()}
        onCancel={() => {
          if (!clearing) setConfirmOpen(false);
        }}
      />
    </section>
  );
}
