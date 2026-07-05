import Link from "next/link";
import ToolSeoContent from "@/app/components/seo/ToolsSEOContent";
import { toolSEO } from "@/app/lib/seo/tools";

export default function Page() {
  return (
    <>
      <div className="brand-shell text-gray-900">
        <main className="mx-auto max-w-5xl px-6 py-12">
          <section className="brand-card rounded-3xl p-6 md:p-8">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[#5a789a]">
              Job Tracker
            </p>
            <h1 className="brand-heading mb-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Track every application in one clear pipeline.
            </h1>
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
              Keep role, company, status, and the exact resume version linked so you always know what was sent and what to follow up next.
            </p>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-[var(--line)] bg-white/90 px-4 py-3 text-sm text-[var(--brand-navy)]">
                Move applications from Saved to Offer with zero spreadsheet drift.
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-white/90 px-4 py-3 text-sm text-[var(--brand-navy)]">
                Link each role to the tailored resume you actually submitted.
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-white/90 px-4 py-3 text-sm text-[var(--brand-navy)]">
                Stay organized for follow-ups, interviews, and decision windows.
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up?redirect_url=/tracker"
                className="brand-button-primary rounded-xl px-6 py-3 text-center text-sm font-semibold"
              >
                Start using Job Tracker
              </Link>
              <Link
                href="/resume-tailor"
                className="brand-button-ghost rounded-xl px-6 py-3 text-center text-sm font-semibold"
              >
                Tailor a resume first
              </Link>
            </div>
          </section>
        </main>
      </div>

      <ToolSeoContent {...toolSEO["job-tracker"]} />
    </>
  );
}
