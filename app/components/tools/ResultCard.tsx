"use client";

import { useState } from "react";

interface ResultCardProps {
  label: string;
  content: string;

  children?: React.ReactNode;
}

export default function ResultCard({
  label,
  content,
  children,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Card header */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
          {label}
        </span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-all
            ${
              copied
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
        >
          {copied ? (
            <>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1.5 5l2.5 2.5 4.5-4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <rect
                  x="5"
                  y="5"
                  width="9"
                  height="9"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
                <path
                  d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
        {children}
      </div>
    </div>
  );
}
