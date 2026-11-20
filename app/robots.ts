import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/sign-in",
        "/sign-up",
        "/api/",
        "/dashboard",
        "/tracker",
        "/analytics",
        "/resume/",
      ],
    },
    sitemap: "https://applycraft.xyz/sitemap.xml",
  };
}
