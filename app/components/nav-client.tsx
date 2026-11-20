"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const tools = [
  {
    href: "/job-tracker",
    title: "Job Tracker",
    description: "Track every application and status in one place",
  },
  {
    href: "/resume-tailor",
    title: "Resume Tailor",
    description: "Tailor your resume for any job posting",
  },
  {
    href: "/ats-resume-checker",
    title: "ATS Resume Checker",
    description: "Check your resume against ATS requirements",
  },
  {
    href: "/cover-letter-generator",
    title: "Cover Letter Generator",
    description: "Create a personalized cover letter",
  },
  {
    href: "/resume-bullet-improver",
    title: "Resume Bullet Improver",
    description: "Rewrite your experience bullets",
  },
  {
    href: "/resume-summary-generator",
    title: "Resume Summary Generator",
    description: "Create a professional resume summary",
  },
];

export function NavPublic() {
  const [menuOpen, setMenuOpen] = useState(false);
  const guestTrackerHref = "/sign-up?redirect_url=/tracker";

  return (
    <>
      <nav className="hidden items-center gap-5 sm:flex">
        <Link
          href="/resume-tailor"
          className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
        >
          Start Here
        </Link>

        <ToolsDropdown />

        <ThemeToggle />

        <Link
          href="/sign-in"
          className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
        >
          Sign In
        </Link>

        <Link
          href="/sign-up"
          className="brand-button-primary rounded-lg px-4 py-2 text-sm font-semibold transition-transform hover:scale-[1.02]"
        >
          Get Started
        </Link>
      </nav>

      <button
        className="rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-[var(--brand-soft-cobalt)] hover:text-[var(--brand-ink)] sm:hidden"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        aria-controls="mobile-main-nav"
      >
        <span className="mb-1 block h-0.5 w-5 bg-current" />
        <span className="mb-1 block h-0.5 w-5 bg-current" />
        <span className="block h-0.5 w-5 bg-current" />
      </button>

      {menuOpen && (
        <div
          id="mobile-main-nav"
          className="absolute left-0 right-0 top-16 z-40 flex flex-col gap-4 border-b border-[var(--line)] bg-white/95 px-5 py-5 shadow-lg backdrop-blur sm:hidden"
        >
          <div className="rounded-xl border border-[var(--line)] bg-white px-3 py-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Start
            </p>
            <Link
              href="/resume-tailor"
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-[var(--brand-ink)]"
            >
              Resume Tailor
            </Link>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-white px-3 py-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Tools
            </p>
            <div className="space-y-1.5">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-1 py-1 text-sm text-[var(--brand-ink)] hover:text-[var(--brand-cobalt)]"
                >
                  {tool.title}
                </Link>
              ))}
              <Link
                href={guestTrackerHref}
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-1 py-1 text-sm text-[var(--brand-ink)] hover:text-[var(--brand-cobalt)]"
              >
                Job Tracker
              </Link>
            </div>
          </div>

          <Link
            href="/sign-in"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-[var(--brand-ink)]"
          >
            Sign In
          </Link>

          <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
            <span className="text-sm text-[var(--muted)]">Appearance</span>
            <ThemeToggle />
          </div>

          <Link
            href="/sign-up"
            onClick={() => setMenuOpen(false)}
            className="brand-button-primary rounded-lg px-3.5 py-2 text-center text-sm font-semibold"
          >
            Get Started
          </Link>
        </div>
      )}
    </>
  );
}

export function NavAuth({ canSeeAnalytics = false }: { canSeeAnalytics?: boolean }) {
  return (
    <nav className="flex items-center gap-6">
      <Link
        href="/dashboard"
        className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
      >
        Dashboard
      </Link>
      <Link
        href="/tracker"
        className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
      >
        Job Tracker
      </Link>
      {canSeeAnalytics && (
        <Link
          href="/analytics"
          className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
        >
          Analytics
        </Link>
      )}
      <ToolsDropdown />
    </nav>
  );
}

function ToolsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand-cobalt)]"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Tools
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        className={`absolute left-0 top-full z-50 mt-3 w-72 rounded-xl border border-[var(--line)] bg-white p-2 shadow-xl ${open ? "block" : "hidden"}`}
      >
        {tools.map((tool) => (
          <DropdownItem key={tool.href} {...tool} />
        ))}
      </div>
    </div>
  );
}

function DropdownItem({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg px-3 py-2 transition-colors hover:bg-[var(--brand-soft-cobalt)]"
    >
      <div className="text-sm font-medium text-[var(--brand-ink)]">{title}</div>

      <div className="mt-0.5 text-xs text-[var(--muted)]">{description}</div>
    </Link>
  );
}
