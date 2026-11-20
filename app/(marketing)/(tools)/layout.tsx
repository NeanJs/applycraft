import { auth, currentUser } from "@clerk/nextjs/server";
import Footer from "@/app/components/Footer";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import { canAccessAnalytics } from "@/app/lib/internal-access";

export default async function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const canSeeAnalytics = user
    ? canAccessAnalytics({
        userId: user.id,
        emails: user.emailAddresses.map((email) => email.emailAddress),
      })
    : false;

  return (
    <div className="min-h-screen bg-[var(--brand-warm-white)]">
      <DashboardSidebar
        canSeeAnalytics={canSeeAnalytics}
        isSignedIn={!!userId}
      />
      <main className="min-h-screen min-w-0 md:pl-64">
        {children}
        <Footer />
      </main>
    </div>
  );
}
