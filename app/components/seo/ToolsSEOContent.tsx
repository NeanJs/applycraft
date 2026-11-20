"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/app/lib/analytics/trackEvent";

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

function markSeoInteraction(source: string, label: string) {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem("applycraft_seen_tool_content", "1");
  }
  trackEvent("tool_content_interaction", {
    source,
    label,
    path: typeof window !== "undefined" ? window.location.pathname : "",
  });
}

function sanitizeSchemaText(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function FAQItem({
  faq,
  defaultOpen = false,
}: {
  faq: FAQ;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group rounded-2xl border border-zinc-200 bg-white overflow-hidden transition-colors open:border-zinc-300 open:bg-zinc-50"
      open={defaultOpen}
      onToggle={(event) => {
        const element = event.currentTarget;
        if (element.open) {
          markSeoInteraction("faq", faq.question);
        }
      }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 text-left">
        <span className="pr-4 font-medium leading-snug text-zinc-900">
          {faq.question}
        </span>
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-all group-open:rotate-180 group-open:bg-zinc-900 group-open:text-white">
          <ChevronDown className="h-3.5 w-3.5" />
        </span>
      </summary>

      <div className="px-6 pb-5 text-[0.9375rem] leading-7 text-zinc-600">
        <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
      </div>
    </details>
  );
}

export default function ToolSeoContent({
  title,
  intro,
  sections,
  faqs,
}: ToolSeoContentProps) {
  return (
    <article className="relative w-full border-t border-[var(--line)]/80 bg-transparent py-20">
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="brand-card mb-5 rounded-2xl px-5 py-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-[#53637a]">
              Keep your search organized: optimize here, then track each application in your Job Tracker pipeline.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="#tool-workspace"
                onClick={() => {
                  markSeoInteraction("return_cta", "back_to_tool");
                  trackEvent("back_to_tool_clicked", {
                    path:
                      typeof window !== "undefined" ? window.location.pathname : "",
                  });
                }}
                className="brand-button-ghost rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors"
              >
                Back to tool
              </a>
              <Link
                href="/sign-up?redirect_url=/tracker"
                onClick={() => {
                  markSeoInteraction("tracker_cta", "go_to_tracker");
                }}
                className="brand-button-primary rounded-xl px-3 py-1.5 text-xs font-semibold"
              >
                Open Job Tracker
              </Link>
            </div>
          </div>
        </div>

        <div className="brand-mesh rounded-3xl border border-[var(--line)]/80 px-8 py-16 shadow-sm md:px-14 md:py-20">
          <header className="mb-12 max-w-3xl">
            <span className="brand-pill inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
              Deep Guide
            </span>
            {title && (
              <h2 className="brand-heading mb-5 mt-3 text-3xl font-semibold leading-tight text-[#0f2038] md:text-[2.625rem]">
                {title}
              </h2>
            )}

            <p className="text-lg leading-relaxed text-[#53637a]">{intro}</p>
          </header>

          <section className="mb-16">
            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#5e7a9a]">
                How It Works
              </p>
              <h2 className="text-2xl font-semibold text-[#0f2038]">
                Understand before you optimize
              </h2>
            </div>

            <div className="space-y-3">
              {sections.map((section, index) => (
                <details
                  key={section.heading}
                  className="group rounded-2xl border border-[var(--line)] bg-white/85"
                  open={index === 0}
                  onToggle={(event) => {
                    const element = event.currentTarget;
                    if (element.open) {
                      markSeoInteraction("section", section.heading);
                    }
                  }}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#10213b] text-[11px] font-semibold text-white">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-semibold text-[#0f2038] md:text-base">
                        {section.heading}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-[#5b6b84] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="px-5 pb-5 text-[0.9375rem] leading-7 text-[#53637a]">
                    {section.body}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {faqs.length > 0 && (
            <section>
              <div className="mb-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#5e7a9a]">
                  FAQ
                </p>

                <h2 className="text-2xl font-semibold text-[#0f2038] md:text-3xl">
                  Frequently asked questions
                </h2>
              </div>

              <div className="space-y-2.5">
                {faqs.map((faq, index) => (
                  <FAQItem key={faq.question} faq={faq} defaultOpen={index === 0} />
                ))}
              </div>
            </section>
          )}

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
                    text: sanitizeSchemaText(f.answer),
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
