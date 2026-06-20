"use client";

import { Briefcase } from "lucide-react";
import InputPanel from "../inputs/InputPanel";

interface JobDescriptionInputProps {
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
}

export default function JobDescriptionInput({
  value,
  onChange,
  maxLength = 4000,
}: JobDescriptionInputProps) {
  const hasJD = value.trim().length > 0;

  return (
    <InputPanel
      title="Job description"
      icon={<Briefcase size={14} />}
      placeholder="Paste the job description here..."
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      footer
      badge={
        hasJD ? (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
            ready
          </span>
        ) : null
      }
    />
  );
}
