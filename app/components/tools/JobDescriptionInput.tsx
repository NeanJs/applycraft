"use client";

interface JobDescriptionInputProps {
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
}

export default function JobDescriptionInput({
  value,
  onChange,
  maxLength = 2500,
}: JobDescriptionInputProps) {
  const hasJD = value.trim().length > 0;

  return (
    <div className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect
              x="1"
              y="3"
              width="14"
              height="11"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.25"
            />
            <path
              d="M5 7h6M5 10h4"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
          Job description
        </div>
        {hasJD ? (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
            ready
          </span>
        ) : (
          <span className="text-[11px] text-gray-300">
            0 / {maxLength.toLocaleString()}
          </span>
        )}
      </div>

      {/* Textarea */}
      <textarea
        className="flex-1 min-h-[200px] px-4 py-3 text-sm text-gray-900 bg-white placeholder-gray-300 resize-none focus:outline-none leading-relaxed"
        placeholder={
          "Paste the full job description here…\n\nTip: include the complete posting for the best keyword match."
        }
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
      />
    </div>
  );
}
