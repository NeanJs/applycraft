"use client";

import { useState } from "react";

const jobs = [
  {
    label: "Server / Bartender",
    before: 54,
    after: 91,
    kwB: "6 / 18",
    kwA: "17 / 18",
    bd: [89, 78, 82, 94],
    missing: ["Upselling", "POS systems", "Food safety", "+5 more"],
    bulletBefore: "Helped guests and took their orders during shifts.",
    bulletAfter:
      "Managed multi-table sections during peak service, upselling menu items and processing payments accurately through POS systems while maintaining food safety standards.",
  },
  {
    label: "Retail Associate",
    before: 49,
    after: 88,
    kwB: "5 / 16",
    kwA: "15 / 16",
    bd: [85, 80, 76, 91],
    missing: ["Inventory mgmt", "Merchandising", "KPIs", "+4 more"],
    bulletBefore:
      "Stocked shelves and helped customers find things in the store.",
    bulletAfter:
      "Maintained floor inventory and visual merchandising standards while assisting customers, contributing to measurable increases in upsell conversions during peak hours.",
  },
  {
    label: "Admin Assistant",
    before: 51,
    after: 89,
    kwB: "7 / 20",
    kwA: "18 / 20",
    bd: [87, 83, 79, 88],
    missing: ["Calendar mgmt", "Scheduling", "MS Office", "+6 more"],
    bulletBefore: "Answered phones and scheduled meetings for the team.",
    bulletAfter:
      "Coordinated executive calendars and managed scheduling across departments using MS Office, reducing meeting conflicts and improving cross-team communication.",
  },
  {
    label: "Software Engineer",
    before: 57,
    after: 93,
    kwB: "8 / 22",
    kwA: "21 / 22",
    bd: [92, 81, 86, 95],
    missing: ["TypeScript", "System design", "CI/CD", "+7 more"],
    bulletBefore: "Worked on the backend and fixed some bugs in the codebase.",
    bulletAfter:
      "Improved backend reliability by refactoring core services in TypeScript, reducing bug rate by 40% and cutting deployment time through CI/CD pipeline improvements.",
  },
];

export default function ShowcaseSection() {
  const [active, setActive] = useState(0);
  const j = jobs[active];
  const delta = j.after - j.before;

  return (
    <section className="w-full py-16 px-4">
      {/* Switcher */}
      <div className="text-center mb-8">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">
          See it work for your role
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {jobs.map((job, i) => (
            <button
              key={job.label}
              onClick={() => setActive(i)}
              className={`text-xs px-4 py-2 rounded-full border transition-all ${
                active === i
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {job.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="relative max-w-3xl mx-auto rounded-2xl bg-gray-50 p-6 overflow-hidden">
        {/* Resume texture background */}
        <div className="absolute inset-0 p-8 opacity-[0.08] pointer-events-none flex flex-col gap-2">
          <div className="h-3 w-[35%] bg-gray-900 rounded mb-1" />
          <div className="h-2 w-[22%] bg-gray-600 rounded mb-4" />
          {[90, 78, 85, 60, 95, 82, 88, 70, 91, 88, 75, 65].map((w, i) => (
            <div
              key={i}
              className="h-1.5 bg-gray-700 rounded"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Before card */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                Original resume
              </span>
            </div>

            <div className="mb-1">
              <span className="text-4xl font-semibold tracking-tight text-red-500">
                {j.before}%
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mb-2">ATS score</p>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-red-400 rounded-full transition-all duration-700"
                style={{ width: `${j.before}%` }}
              />
            </div>

            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-sm font-medium text-red-500">{j.kwB}</span>
              <span className="text-[11px] text-gray-400">
                keywords matched
              </span>
            </div>

            <div className="h-px bg-gray-100 mb-3" />

            <p className="text-[10px] font-medium text-red-400 uppercase tracking-widest mb-2">
              Missing keywords
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {j.missing.map((k) => (
                <span
                  key={k}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100"
                >
                  {k}
                </span>
              ))}
            </div>

            <div className="h-px bg-gray-100 mb-3" />

            <p className="text-[9px] font-medium text-gray-300 uppercase tracking-widest mb-1.5">
              Bullet — original
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-[11px] text-gray-400 leading-relaxed">
              {j.bulletBefore}
            </div>
          </div>

          {/* After card */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-1.5 mb-3 flex-wrap">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                ApplyCraft rewrite
              </span>
              <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                +{delta}%
              </span>
            </div>

            <div className="mb-1">
              <span className="text-4xl font-semibold tracking-tight text-emerald-700">
                {j.after}%
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mb-2">ATS score</p>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                style={{ width: `${j.after}%` }}
              />
            </div>

            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-sm font-medium text-emerald-700">
                {j.kwA}
              </span>
              <span className="text-[11px] text-emerald-600">
                keywords matched
              </span>
            </div>

            <div className="h-px bg-gray-100 mb-3" />

            {/* Breakdown */}
            {[
              { label: "Keyword", val: j.bd[0] },
              { label: "Structure", val: j.bd[1] },
              { label: "Readability", val: j.bd[2] },
              { label: "Role match", val: j.bd[3] },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] text-gray-400 w-16 flex-shrink-0">
                  {row.label}
                </span>
                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                    style={{ width: `${row.val}%` }}
                  />
                </div>
                <span className="text-[10px] text-emerald-700 font-medium w-7 text-right">
                  {row.val}%
                </span>
              </div>
            ))}

            <div className="h-px bg-gray-100 my-3" />

            <p className="text-[9px] font-medium text-emerald-600 uppercase tracking-widest mb-1.5">
              Bullet — rewritten
            </p>
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 text-[11px] text-emerald-800 leading-relaxed">
              {j.bulletAfter}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
