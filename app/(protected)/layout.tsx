import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import DashboardSidebar from "../components/DashboardSidebar";
import { canAccessAnalytics } from "@/app/lib/internal-access";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await currentUser();
  const canSeeAnalytics = user
    ? canAccessAnalytics({
        userId: user.id,
        emails: user.emailAddresses.map((email) => email.emailAddress),
      })
    : false;

  return (
    <div className="min-h-screen bg-[var(--brand-warm-white)]">
      <DashboardSidebar canSeeAnalytics={canSeeAnalytics} isSignedIn />
      <main className="min-h-screen min-w-0 md:pl-64">{children}</main>
    </div>
  );
}
