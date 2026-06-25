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
    default: "ApplyCraft | AI Resume Optimizer & ATS Resume Checker",
    template: "%s | ApplyCraft",
  },

  description:
    "Optimize your resume with AI. Improve ATS scores, match job keywords, and create tailored resumes for every job.",

  keywords: [
    "AI resume optimizer",
    "ATS resume checker",
    "resume optimization",
    "AI resume writer",
    "resume keyword matcher",
    "resume scanner",
    "AI cover letter generator",
    "job application assistant",
    "resume improvement tool",
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
    title: "ApplyCraft | AI Resume Optimizer & ATS Resume Checker",

    description:
      "Improve your resume with AI-powered ATS scoring, keyword matching, and job-specific optimization.",

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

    site: "@ApplyCraft",

    title: "ApplyCraft | AI Resume Optimizer",

    description:
      "Create ATS-friendly resumes with AI. Match job descriptions and improve your chances of landing interviews.",

    images: [
      {
        url: "/og-image.png",
        alt: "ApplyCraft AI Resume Optimizer",
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

          <main className="flex-1">{children}</main>

          <Toaster position="top-right" />

          <Analytics />

          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
