// components/navbar.tsx  (server component stays clean)
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { NavPublic, NavAuth } from "./nav-client";
import ThemeToggle from "./ThemeToggle";
import Logo from "@/public/logo.ico";
import Image from "next/image";
import { canAccessAnalytics } from "@/app/lib/internal-access";
export default async function Navbar() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const canSeeAnalytics = user
    ? canAccessAnalytics({
        userId: user.id,
        emails: user.emailAddresses.map((email) => email.emailAddress),
      })
    : false;

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)]/70 bg-white/80 backdrop-blur-xl">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href={userId ? "/dashboard" : "/"}
          className="group flex items-center gap-2.5"
        >
          <Image
            src={Logo}
            className="h-9 w-9 rounded-lg border border-[var(--line)]/80 bg-white p-1 shadow-sm"
            alt="ApplyCraft"
            width={100}
            height={100}
          />
          <span className="text-sm tracking-tight text-[var(--brand-ink)]">
            <strong>Apply</strong>Craft
          </span>
        </Link>

        {!userId && <NavPublic />}
        {userId && (
          <div className="flex items-center gap-6">
            <NavAuth canSeeAnalytics={canSeeAnalytics} />
            <ThemeToggle />
            <UserButton />
          </div>
        )}
      </div>
    </header>
  );
}
