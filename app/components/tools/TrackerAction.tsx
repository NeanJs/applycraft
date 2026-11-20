"use client";

import { useState } from "react";
import TrackerModal from "./TrackerModal";

interface TrackerActionProps {
  resumeId?: string | null;
  generationId?: string | null;
  jobDescription?: string;
  title?: string;
  company?: string;
  role?: string;
}

export default function TrackerAction(props: TrackerActionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors"
      >
        Save to tracker
      </button>
      <TrackerModal open={open} onClose={() => setOpen(false)} {...props} />
    </>
  );
}
