import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import UserSync from "./components/auth/UserSync";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ApplyCraft | Job Application Tracker, Resume Tailor & ATS Checker",
    template: "%s | ApplyCraft",
  },

  description:
    "Track every job application, tailor each resume to the role, and improve ATS match before you apply.",

  keywords: [
    "job application tracker",
    "application tracking tool",
    "job tracker",
    "resume tailoring",
    "ATS resume checker",
    "resume optimization",
    "resume keyword matcher",
    "resume scanner",
    "cover letter generator",
    "resume improvement tool",
    "job search organization",
    "ApplyCraft",
  ],

  metadataBase: new URL("https://applycraft.xyz"),

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.ico",
        sizes: "32x32",
        type: "image/svg+xml",
      },
    ],

    apple: [
      {
        url: "/favicon.ico",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  },

  manifest: "/site.webmanifest",

  openGraph: {
    title: "ApplyCraft | Job Application Tracker, Resume Tailor & ATS Checker",

    description:
      "Organize your job search, tailor resumes per role, and improve ATS match from one workflow.",

    url: "https://applycraft.xyz",

    siteName: "ApplyCraft",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ApplyCraft job tracker and resume tailoring workflow",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    site: "@ApplyCraft",

    title: "ApplyCraft | Job Tracker + Resume Tailoring",

    description:
      "Track applications, tailor resumes to each posting, and improve ATS alignment before submitting.",

    images: [
      {
        url: "/og-image.png",
        alt: "ApplyCraft job tracker and resume tailoring workflow",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  themeColor: "#111827",

  category: "technology",

  creator: "ApplyCraft",

  publisher: "ApplyCraft",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={geist.variable} suppressHydrationWarning>
        <body className="min-h-screen bg-white text-gray-900 antialiased flex flex-col">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",

                name: "ApplyCraft",

                applicationCategory: "BusinessApplication",

                operatingSystem: "Web",

                description:
                  "AI resume optimizer that improves resumes with ATS scoring, keyword matching, tailored resume bullets, and personalized cover letters.",

                url: "https://applycraft.xyz",

                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
              }),
            }}
          />

          <main className="flex-1">
            <UserSync />
            {children}
          </main>

          <Toaster position="top-right" />

          <Analytics />

          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
