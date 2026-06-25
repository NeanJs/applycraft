"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Section = {
  heading: string;
  body: string;
};

type FAQ = {
  question: string;
  answer: string;
};

export type ToolSeoContentProps = {
  title?: string;
  intro: string;
  sections: Section[];
  faqs: FAQ[];
};

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`group rounded-2xl border transition-all duration-200 overflow-hidden ${
        open
          ? "border-zinc-300 bg-zinc-50 shadow-sm"
          : "border-zinc-200 bg-white hover:border-zinc-300"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-zinc-900 pr-4 leading-snug">
          {faq.question}
        </span>
        <span
          className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
            open
              ? "bg-zinc-900 text-white rotate-180"
              : "bg-zinc-100 text-zinc-500"
          }`}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </span>
      </button>

      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 leading-7 text-zinc-600 text-[0.9375rem]">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ToolSeoContent({
  title,
  intro,
  sections,
  faqs,
}: ToolSeoContentProps) {
  return (
    <article className="relative w-full bg-zinc-50 border-t border-zinc-200/80 py-20">
      <div className="relative max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm px-8 md:px-14 py-20">
          {/* Header */}
          <header className="mb-20 max-w-3xl">
            {title && (
              <h2 className="text-3xl md:text-[2.625rem] font-medium tracking-tight text-zinc-900 mb-5 leading-tight">
                {title}
              </h2>
            )}

            <p className="text-lg leading-relaxed text-zinc-500">{intro}</p>
          </header>

          {/* Sections */}
          <div className="space-y-0 mb-24">
            {sections.map((section, index) => (
              <div key={section.heading} className="flex gap-8">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {index < sections.length - 1 && (
                    <div className="w-px flex-1 bg-zinc-200 mt-2 min-h-[2.5rem]" />
                  )}
                </div>

                <div
                  className={`pb-10 ${
                    index === sections.length - 1 ? "pb-0" : ""
                  }`}
                >
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2.5 mt-1.5">
                    {section.heading}
                  </h3>

                  <p className="text-[0.9375rem] leading-7 text-zinc-500">
                    {section.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          {faqs.length > 0 && (
            <section>
              <div className="mb-8">
                <p className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-3">
                  FAQ
                </p>

                <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900">
                  Frequently asked questions
                </h2>
              </div>

              <div className="space-y-2.5">
                {faqs.map((faq) => (
                  <FAQItem key={faq.question} faq={faq} />
                ))}
              </div>
            </section>
          )}

          {/* FAQ Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: f.answer,
                  },
                })),
              }),
            }}
          />
        </div>
      </div>
    </article>
  );
}
