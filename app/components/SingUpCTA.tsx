import Link from "next/link";
import { track } from "@vercel/analytics/react";

interface SignUpCTAProps {
  setShowSignupCTA: (value: boolean) => void;
  source?: string;
  title?: string;
  description?: string;
}

export default function SignUpCTA({
  setShowSignupCTA,
  title,
  description,
  source = "inline_cta",
}: SignUpCTAProps) {
  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <rect
              x="3"
              y="7"
              width="10"
              height="7"
              rx="1"
              stroke="currentColor"
              strokeWidth="1.25"
            />
            <path
              d="M5.5 7V5a2.5 2.5 0 015 0v2"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{title} </p>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => setShowSignupCTA(false)}
          className="text-xs text-gray-400 border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 hover:text-gray-600 transition-colors"
        >
          Maybe later
        </button>
        <Link
          href="/sign-up"
          onClick={() => track("anon_cta_clicked", { source })}
          className="text-xs font-medium text-white bg-gray-900 rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors whitespace-nowrap"
        >
          Create free account →
        </Link>
      </div>
    </div>
  );
}
