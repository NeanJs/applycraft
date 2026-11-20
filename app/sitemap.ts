// app/sitemap.ts
import type { MetadataRoute } from "next";
import { toolSEO } from "@/app/lib/seo/tools";

const baseUrl = "https://applycraft.xyz";

// Use a fixed build-time timestamp instead of new Date() on every request
const lastModified = new Date("2026-07-05T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const toolRoutes: MetadataRoute.Sitemap = Object.keys(toolSEO).map(
    (slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  return [...staticRoutes, ...toolRoutes];
}
