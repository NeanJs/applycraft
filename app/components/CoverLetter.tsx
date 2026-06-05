"use client";

import { useState } from "react";

export default function CoverLetter({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paragraphs = text?.split("\n\n").filter(Boolean) ?? [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-gray-500">
            cover-letter.txt
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150
              ${
                copied
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
              }`}
          >
            {copied ? (
              <>
                <CheckIcon /> Copied
              </>
            ) : (
              <>
                <CopyIcon /> Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      <div
        className={`px-6 py-5 overflow-y-auto transition-all duration-300 ${expanded ? "max-h-none" : "max-h-72"}`}
      >
        <div className="space-y-4">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-sm text-gray-700 leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Fade + expand prompt when collapsed */}
      {!expanded && (
        <div className="relative -mt-8 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <rect
        x="5"
        y="5"
        width="9"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 11H2a1 1 0 01-1-1V2a1 1 0 011-1h8a1 1 0 011 1v1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M2.5 8.5l3.5 3.5 7-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
