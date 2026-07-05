import Image from "next/image";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import Logo from "@/public/logo.ico";
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
    <footer className="mt-12 border-t border-(--line)/70 bg-[#fbfcf8]">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex items-start gap-3">
            <Image
              src={Logo}
              className="w-10 rounded-lg border border-(--line)/80 bg-white p-1"
              alt="logo"
              width={100}
              height={100}
            />
            <div className="text-sm tracking-tight text-(--brand-navy)">
              <div>
                <strong>Apply</strong>Craft
              </div>
              <p className="mt-1 max-w-xs text-(--muted)">
                Craft applications that get noticed.
              </p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-(--muted)">
              Product
            </p>
            <div className="space-y-2">
              <Link
                href="/resume-tailor"
                className="block text-sm text-(--muted) transition-colors hover:text-(--brand-navy)"
              >
                Resume Tailor
              </Link>
              <Link
                href="/job-tracker"
                className="block text-sm text-(--muted) transition-colors hover:text-(--brand-navy)"
              >
                Job Tracker
              </Link>
              <Link
                href="/dashboard"
                className="block text-sm text-(--muted) transition-colors hover:text-(--brand-navy)"
              >
                Dashboard
              </Link>
              {canSeeAnalytics && (
                <Link
                  href="/analytics"
                  className="block text-sm text-(--muted) transition-colors hover:text-(--brand-navy)"
                >
                  Analytics
                </Link>
              )}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-(--muted)">
              Tools
            </p>
            <div className="space-y-2">
              <Link
                href="/ats-resume-checker"
                className="block text-sm text-(--muted) transition-colors hover:text-(--brand-navy)"
              >
                ATS Checker
              </Link>
              <Link
                href="/cover-letter-generator"
                className="block text-sm text-(--muted) transition-colors hover:text-(--brand-navy)"
              >
                Cover Letter Generator
              </Link>
              <Link
                href="/resume-bullet-improver"
                className="block text-sm text-(--muted) transition-colors hover:text-(--brand-navy)"
              >
                Bullet Improver
              </Link>
              <Link
                href="/resume-summary-generator"
                className="block text-sm text-(--muted) transition-colors hover:text-(--brand-navy)"
              >
                Summary Generator
              </Link>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-(--muted)">
              Company
            </p>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-sm text-(--muted) transition-colors hover:text-(--brand-navy)"
              >
                Home
              </Link>
            <Link
              href="/#faqs"
              className="block text-sm text-(--muted) transition-colors hover:text-(--brand-navy)"
            >
              FAQ
            </Link>
            <a
              href="mailto:hello@applycraft.xyz"
              className="block text-sm text-(--muted) transition-colors hover:text-(--brand-navy)"
            >
              Contact
            </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-(--line)/70 pt-4 sm:flex-row">
          <p className="text-center text-xs text-(--muted)">
            &copy; {new Date().getFullYear()} ApplyCraft. All rights reserved.
          </p>
          <p className="text-xs text-(--muted)">
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
