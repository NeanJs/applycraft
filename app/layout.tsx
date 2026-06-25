import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ApplyCraft - AI Resume Optimizer",
    template: "%s | ApplyCraft",
  },

  description:
    "Optimize your resume with AI. Get ATS scores, keyword matches, tailored bullets, and cover letters for any job in seconds.",

  keywords: [
    "AI resume optimizer",
    "ATS resume checker",
    "resume optimization",
    "AI resume writer",
    "resume keyword matcher",
    "resume scanner",
    "AI cover letter generator",
    "resume builder AI",
    "job application assistant",
    "resume improvement tool",
    "job search AI",
    "ApplyCraft",
  ],

  metadataBase: new URL(process.env.BASE_URL ?? "https://applycraft.xyz"),

  alternates: {
    canonical: "https://applycraft.xyz",
  },

  openGraph: {
    title: "ApplyCraft - AI Resume Optimizer",

    description:
      "AI-powered resume optimization with ATS scoring, keyword matching, and tailored cover letters.",

    url: "https://applycraft.xyz",

    siteName: "ApplyCraft",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ApplyCraft AI Resume Optimizer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "ApplyCraft - AI Resume Optimizer",

    description:
      "Improve your resume with AI ATS scoring, keyword matching, and tailored cover letters.",

    images: ["/og-image.png"],
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

          <main className="flex-1">{children}</main>

          <Toaster position="top-right" />

          <Analytics />

          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
