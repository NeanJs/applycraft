"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  BriefcaseBusiness,
  ChartNoAxesColumn,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Mail,
  Menu,
  ScanSearch,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import ThemeToggle from "./ThemeToggle";

const primaryLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tracker", label: "Job tracker", icon: BriefcaseBusiness },
];

const toolLinks = [
  { href: "/resume-tailor", label: "Resume tailor", icon: FileText },
  { href: "/ats-resume-checker", label: "ATS checker", icon: ScanSearch },
  { href: "/cover-letter-generator", label: "Cover letter", icon: Mail },
  {
    href: "/resume-bullet-improver",
    label: "Bullet improver",
    icon: ClipboardCheck,
  },
  {
    href: "/resume-summary-generator",
    label: "Summary writer",
    icon: FileText,
  },
];

export default function DashboardSidebar({
  canSeeAnalytics,
  isSignedIn,
}: {
  canSeeAnalytics: boolean;
  isSignedIn: boolean;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    return href === "/dashboard"
      ? pathname === href || pathname.startsWith("/resume/")
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  function renderLinks(
    links: { href: string; label: string; icon: LucideIcon }[],
  ) {
    return links.map(({ href, label, icon: Icon }) => {
      const active = isActive(href);
      return (
        <Link
          key={href}
          href={href}
          onClick={() => setMobileOpen(false)}
          aria-current={active ? "page" : undefined}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
            active
              ? "bg-[var(--brand-soft-cobalt)] font-semibold text-[var(--brand-cobalt)]"
              : "text-[var(--muted)] hover:bg-[var(--brand-warm-white)] hover:text-[var(--brand-ink)]"
          }`}
        >
          <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
          {label}
        </Link>
      );
    });
  }
// New Sidebar Feature
  const sidebar = (
    <div className="flex h-full flex-col bg-white">
      <Link
        href={isSignedIn ? "/dashboard" : "/"}
        className="flex h-16 items-center gap-2.5 border-b border-[var(--line)] px-5"
        onClick={() => setMobileOpen(false)}
      >
        <Image
          src="/logo.ico"
          alt=""
          unoptimized
          width={36}
          height={36}
          className="rounded-lg border border-[var(--line)] bg-white p-1"
        />
        <span className="text-sm tracking-tight text-[var(--brand-ink)]">
          <strong>Apply</strong>Craft
        </span>
      </Link>

      <nav aria-label="ApplyCraft navigation" className="flex-1 space-y-6 p-4">
        {isSignedIn && (
          <div className="space-y-1">{renderLinks(primaryLinks)}</div>
        )}

        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            Tools
          </p>
          <div className="space-y-1">{renderLinks(toolLinks)}</div>
        </div>

        {canSeeAnalytics && (
          <div className="space-y-1">
            {renderLinks([
              {
                href: "/analytics",
                label: "Analytics",
                icon: ChartNoAxesColumn,
              },
            ])}
          </div>
        )}
      </nav>

      {isSignedIn ? (
        <div className="flex items-center justify-between gap-2 border-t border-[var(--line)] px-4 py-4">
          <div className="flex items-center gap-3">
            <UserButton />
            <span className="text-xs text-[var(--muted)]">Account</span>
          </div>
          <ThemeToggle />
        </div>
      ) : (
        <div className="space-y-2 border-t border-[var(--line)] p-4">
          <div className="mb-3 flex justify-center">
            <ThemeToggle />
          </div>
          <Link
            href="/sign-in"
            className="block rounded-xl px-3 py-2.5 text-center text-sm font-medium text-[var(--muted)] hover:bg-[var(--brand-warm-white)]"
            onClick={() => setMobileOpen(false)}
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="brand-button-primary block rounded-xl px-3 py-2.5 text-center text-sm font-semibold"
            onClick={() => setMobileOpen(false)}
          >
            Create account
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--line)] bg-white px-4 md:hidden">
        <Link
          href={isSignedIn ? "/dashboard" : "/"}
          className="flex items-center gap-2"
        >
          <Image src="/logo.ico" alt="" width={30} height={30} unoptimized/>
          <span className="text-sm font-semibold text-[var(--brand-ink)]">
            ApplyCraft
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          aria-controls="dashboard-sidebar"
          className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--brand-warm-white)]"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-[var(--line)] md:block">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--brand-ink)]/35"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            id="dashboard-sidebar"
            aria-label="ApplyCraft navigation"
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-[var(--line)] shadow-xl"
          >
            {sidebar}
          </aside>
        </div>
      )}
    </>
  );
}
