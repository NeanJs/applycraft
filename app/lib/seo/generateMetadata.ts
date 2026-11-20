import { Metadata } from "next";
import { toolSEO } from "./tools";

const SHARED_KEYWORDS = [
  "job application tracker",
  "job tracker",
  "application tracking tool",
  "resume tailoring",
  "ATS resume checker",
  "job search workflow",
  "applycraft",
];

export function generateToolMetadata(slug: keyof typeof toolSEO): Metadata {
  const seo = toolSEO[slug];
  const keywords = Array.from(new Set([...seo.keywords, ...SHARED_KEYWORDS]));

  return {
    title: { absolute: seo.title },
    description: seo.description,
    keywords,
    alternates: {
      canonical: `https://applycraft.xyz/${slug}`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `https://applycraft.xyz/${slug}`,
      siteName: "ApplyCraft",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${seo.title} | ApplyCraft`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/og-image.png"],
    },
  };
}
