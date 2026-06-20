"use client";

import Link from "next/link";
import { track } from "@vercel/analytics/react";

interface Props {
  source: string;
  onDismiss: () => void;
}

export default function AnonStickyCTA({ source, onDismiss }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-900">Like what you see?</span>{" "}
          Sign up free to save this and run more analyses.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onDismiss}
          className="hidden sm:block text-xs text-gray-400 border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300"
        >
          Dismiss
        </button>

        <Link
          href="/sign-up"
          onClick={() => track("anon_cta_clicked", { source })}
          className="text-xs font-medium text-white bg-gray-900 rounded-lg px-4 py-2"
        >
          Create free account →
        </Link>
      </div>
    </div>
  );
}
