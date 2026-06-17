// components/navbar-client.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const tools = [
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

  return (
    <>
      {/* Desktop */}
      <nav className="hidden sm:flex items-center gap-6">
        <a
          href="#features"
          className="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          Features
        </a>

        <a
          href="#how-it-works"
          className="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          How It Works
        </a>

        <ToolsDropdown />

        <Link
          href="/sign-in"
          className="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          Sign In
        </Link>

        <Link
          href="/sign-up"
          className="bg-gray-900 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition"
        >
          Get Started →
        </Link>
      </nav>

      {/* Mobile hamburger */}
      <button
        className="sm:hidden p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <span className="block w-5 h-0.5 bg-current mb-1" />
        <span className="block w-5 h-0.5 bg-current mb-1" />
        <span className="block w-5 h-0.5 bg-current" />
      </button>

      {/* Mobile */}
      {menuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-4 sm:hidden">
          <a
            href="#features"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-700"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-700"
          >
            How It Works
          </a>

          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Tools
            </p>

            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-700"
              >
                {tool.title}
              </Link>
            ))}
          </div>

          <Link
            href="/sign-in"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-700"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            onClick={() => setMenuOpen(false)}
            className="bg-gray-900 text-white px-3.5 py-2 rounded-lg text-sm font-medium text-center"
          >
            Get Started →
          </Link>
        </div>
      )}
    </>
  );
}

export function NavAuth() {
  return (
    <nav className="flex items-center gap-6">
      <Link
        href="/dashboard"
        className="text-sm text-gray-500 hover:text-gray-900 transition"
      >
        Dashboard
      </Link>

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
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition"
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

      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 rounded-xl border border-gray-200 bg-white shadow-lg p-2 z-50">
          {tools.map((tool) => (
            <DropdownItem key={tool.href} {...tool} />
          ))}
        </div>
      )}
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
      className="block rounded-lg px-3 py-2 hover:bg-gray-50 transition"
    >
      <div className="text-sm font-medium text-gray-900">{title}</div>

      <div className="text-xs text-gray-500 mt-0.5">{description}</div>
    </Link>
  );
}
