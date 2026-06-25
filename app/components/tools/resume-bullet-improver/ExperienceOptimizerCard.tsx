"use client";

import { useState } from "react";
import { ExperienceOptimizerResults } from "@/app/types/tailor";

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <rect
        x="5"
        y="5"
        width="8"
        height="8"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M3 11V3.75C3 3.336 3.336 3 3.75 3H11"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ExperienceOptimizerCard({ experiences }: ExperienceOptimizerResults) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const totalBullets = experiences.reduce(
    (total, experience) => total + experience.improvedBullets.length,
    0,
  );

  function copyOne(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);

      setTimeout(() => {
        setCopiedKey(null);
      }, 2000);
    });
  }

  function copyAll() {
    const text = experiences
      .flatMap((experience) =>
        experience.improvedBullets.map((bullet) => `• ${bullet}`),
      )
      .join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true);

      setTimeout(() => {
        setCopiedAll(false);
      }, 2000);
    });
  }

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
          Optimized Experience
        </span>

        <button
          onClick={copyAll}
          className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-all ${
            copiedAll
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          {copiedAll ? (
            <>
              <CheckIcon />
              Copied all
            </>
          ) : (
            <>
              <CopyIcon />
              Copy all
            </>
          )}
        </button>
      </div>

      {/* Experiences */}
      <div>
        {experiences.map((experience, index) => (
          <section
            key={index}
            className="border-b border-gray-100 last:border-none"
          >
            {/* Experience heading */}
            <div className="px-5 py-3 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900">
                {experience.role}
              </h3>

              <p className="text-xs text-gray-500 mt-0.5">{experience.company}</p>
            </div>

            {/* Bullets */}
            <ul className="divide-y divide-gray-100">
              {experience.improvedBullets.map((bullet, bulletIndex) => {
                const key = `${index}-${bulletIndex}`;

                return (
                  <li
                    key={key}
                    className="group px-5 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />

                    <p className="flex-1 text-sm text-gray-900 leading-relaxed">
                      {bullet}
                    </p>

                    <button
                      onClick={() => copyOne(bullet, key)}
                      className={`shrink-0 flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all opacity-0 group-hover:opacity-100 ${
                        copiedKey === key
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700 opacity-100"
                          : "bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {copiedKey === key ? (
                        <>
                          <CheckIcon />
                          Copied
                        </>
                      ) : (
                        <>
                          <CopyIcon />
                          Copy
                        </>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-gray-100">
        <p className="text-[11px] text-gray-400">
          {totalBullets} bullet{totalBullets !== 1 ? "s" : ""} optimized across {experiences.length} experience{experiences.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
