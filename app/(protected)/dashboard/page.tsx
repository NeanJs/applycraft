import Link from "next/link";
import { syncUser } from "@/app/lib/sync-user";

import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/app/lib/prisma";

async function getResumes(userId: string) {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, updatedAt: true },
  });
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function DashboardPage() {
  const user = await syncUser();
  const resumes = user ? await getResumes(user.id) : [];
  const firstName = user?.name?.split(" ")[0] ?? user?.email ?? "there";

  return (
    <DashboardUI
      resumes={resumes}
      firstName={firstName}
      email={user?.email ?? ""}
    />
  );
}

function DashboardUI({
  resumes,
  firstName,
  email,
}: {
  resumes: {
    id: string;
    title: string;
    updatedAt: Date;
  }[];
  firstName: string;
  email: string;
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-sm z-20">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-gray-900 inline-block" />
            <span className="text-sm font-semibold tracking-tight">
              ApplyCraft
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:block">
              {email}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
              Dashboard
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Good to see you, {firstName}.
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              {resumes.length === 0
                ? "You haven't created any resumes yet."
                : `You have ${resumes.length} resume${resumes.length > 1 ? "s" : ""}.`}
            </p>
          </div>

          <Link
            href={"/tools/optimize"}
            className="bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap cursor-pointer"
          >
            + Create Resume
          </Link>
        </div>

        {/* Resume list */}
        {resumes.length > 0 ? (
          <div className="grid gap-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="group border border-gray-200 rounded-xl px-6 py-5 flex items-center justify-between hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-300 group-hover:text-gray-500 group-hover:border-gray-300 transition-colors shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect
                        x="3"
                        y="1"
                        width="10"
                        height="14"
                        rx="1.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <line
                        x1="5.5"
                        y1="5"
                        x2="10.5"
                        y2="5"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                      <line
                        x1="5.5"
                        y1="7.5"
                        x2="10.5"
                        y2="7.5"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                      <line
                        x1="5.5"
                        y1="10"
                        x2="8.5"
                        y2="10"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {resume.title || "Untitled Resume"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Updated {formatDate(resume.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <Link
                    href={`/resume/${resume.id}`}
                    className="text-xs font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors"
                  >
                    Open →
                  </Link>
                  <button
                    type="button"
                    className="text-xs font-medium text-red-400 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="border border-dashed border-gray-200 rounded-2xl py-20 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300 mb-5">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect
                  x="4"
                  y="2"
                  width="14"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <line
                  x1="8"
                  y1="7"
                  x2="14"
                  y2="7"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <line
                  x1="8"
                  y1="10.5"
                  x2="14"
                  y2="10.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <line
                  x1="8"
                  y1="14"
                  x2="11"
                  y2="14"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              No resumes yet
            </p>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              Create your first resume and start applying to jobs today.
            </p>

            <Link
              href="/tools/optimize"
              className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Create your first resume →
            </Link>
          </div>
        )}

        {resumes.length > 0 && (
          <p className="text-xs text-gray-300 text-center mt-10">
            {resumes.length} resume{resumes.length > 1 ? "s" : ""} · Last
            updated {formatDate(resumes[0].updatedAt)}
          </p>
        )}
      </main>
    </div>
  );
}
