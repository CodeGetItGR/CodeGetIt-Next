import type { MetadataRoute } from "next";

const siteUrl = "https://codegetit.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login", "/offers"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
