"use client";

import { useState } from "react";

const examples = [
  {
    label: "Server / Bartender",
    original: "Helped guests and took their orders during shifts.",
    rewritten: "Assisted guests and processed their orders during shifts.",
  },
  {
    label: "Retail Associate",
    original: "Stocked shelves and helped customers find things in the store.",
    rewritten: "Restocked shelves and helped customers locate products.",
  },
  {
    label: "Admin Assistant",
    original: "Answered phones and scheduled meetings for the team.",
    rewritten: "Answered phone calls and scheduled team meetings.",
  },
  {
    label: "Software Engineer",
    original: "Worked on the backend and fixed some bugs in the codebase.",
    rewritten: "Worked on backend code and fixed bugs in the codebase.",
  },
];

export default function ShowcaseSection() {
  const [active, setActive] = useState(0);
  const example = examples[active];

  return (
    <section className="w-full px-4 py-8">
      <div className="mb-8 text-center">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-gray-400">
          Illustrative wording examples
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {examples.map((item, index) => (
            <button
              key={item.label}
              onClick={() => setActive(index)}
              className={`rounded-full border px-4 py-2 text-xs transition-all ${
                active === index
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-gray-50 p-6">
        <p className="mb-4 text-xs leading-relaxed text-gray-500">
          Fictional examples show wording changes only. They are not generated
          results, measured ATS scores, or evidence of candidate qualifications.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ExampleCard label="Original wording" text={example.original} />
          <ExampleCard label="Clearer wording" text={example.rewritten} />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-gray-500">
          The rewrite preserves the stated activity and adds no metrics, tools,
          responsibilities, or outcomes.
        </p>
      </div>
    </section>
  );
}

function ExampleCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-gray-400">
        {label}
      </p>
      <p className="rounded-lg bg-gray-50 px-3 py-3 text-sm leading-relaxed text-gray-700">
        {text}
      </p>
    </div>
  );
}
