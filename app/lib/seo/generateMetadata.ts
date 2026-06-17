import { Metadata } from "next";
import { toolSEO } from "./tools";

export function generateToolMetadata(slug: keyof typeof toolSEO): Metadata {
  const seo = toolSEO[slug];

  return {
    title: seo.title,
    description: seo.description,

    keywords: seo.keywords,

    alternates: {
      canonical: `https://applycraft.xyz/${slug}`,
    },

    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `https://applycraft.xyz/${slug}`,
      siteName: "ApplyCraft",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}
