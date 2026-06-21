// app/sitemap.ts
import type { MetadataRoute } from "next";
import { toolSEO } from "@/app/lib/seo/tools"; // adjust path to your actual file

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://applycraft.xyz";

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  ];

  const toolRoutes = Object.keys(toolSEO).map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...toolRoutes];
}
