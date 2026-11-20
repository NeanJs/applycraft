import Image from "next/image";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";

import { canAccessAnalytics } from "@/app/lib/internal-access";

export default async function Footer() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const canSeeAnalytics = user
    ? canAccessAnalytics({
        userId: user.id,
        emails: user.emailAddresses.map((email) => email.emailAddress),
      })
    : false;

  return (
    <footer className="mt-12 border-t border-[var(--line)] bg-[var(--brand-warm-white)]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex items-start gap-3">
            <Image
              src="./logo.ico"
              className="h-9 w-9 rounded-lg border border-[var(--line)] bg-white p-1"
              alt="ApplyCraft"
              width={100}
              height={100}
              unoptimized
            />
            <div className="text-sm tracking-tight text-[var(--brand-ink)]">
              <div>
                <strong>Apply</strong>Craft
              </div>
              <p className="mt-1 max-w-xs text-(--muted)">
                One workspace for your job search.
              </p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Product
            </p>
            <div className="space-y-2">
              <Link
                href="/resume-tailor"
                className="block text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
              >
                Resume Tailor
              </Link>
              <Link
                href="/job-tracker"
                className="block text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
              >
                Job Tracker
              </Link>
              <Link
                href="/dashboard"
                className="block text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
              >
                Dashboard
              </Link>
              {canSeeAnalytics && (
                <Link
                  href="/analytics"
                  className="block text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
                >
                  Analytics
                </Link>
              )}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Tools
            </p>
            <div className="space-y-2">
              <Link
                href="/ats-resume-checker"
                className="block text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
              >
                ATS Checker
              </Link>
              <Link
                href="/cover-letter-generator"
                className="block text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
              >
                Cover Letter Generator
              </Link>
              <Link
                href="/resume-bullet-improver"
                className="block text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
              >
                Bullet Improver
              </Link>
              <Link
                href="/resume-summary-generator"
                className="block text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
              >
                Summary Generator
              </Link>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Company
            </p>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
              >
                Home
              </Link>
            <Link
              href="/#faqs"
              className="block text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
            >
              FAQ
            </Link>
            <a
              href="mailto:hello@applycraft.xyz"
              className="block text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
            >
              Contact
            </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-[var(--line)] pt-4 sm:flex-row">
          <p className="text-center text-xs text-[var(--muted)]">
            &copy; {new Date().getFullYear()} ApplyCraft. All rights reserved.
          </p>
          <p className="text-xs text-[var(--muted)]">
            Crafted with ❤️ By{" "}
            <a
              className="text-[var(--sky)] hover:underline"
              href="https://nijanadhikari.com.np"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nijan Adhikari
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
