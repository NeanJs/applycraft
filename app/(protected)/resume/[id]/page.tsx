import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import ResumeResultsSkeleton from "@/app/components/dashboard/ResumeResultsSkeleton";
import ResumeResultsLoader from "@/app/components/dashboard/ResumeResultsLoader";

interface ResumePageProps {
  params: { id: string };
}

export default async function ResumePage({ params }: ResumePageProps) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-8 transition-colors"
        >
          <ChevronLeft size={14} />
          All resumes
        </Link>
        <Suspense fallback={<ResumeResultsSkeleton />}>
          <ResumeResultsLoader userId={userId} resumeId={id} />
        </Suspense>
      </div>
    </div>
  );
}
