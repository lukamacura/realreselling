import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/success", "/cancel", "/uplatnica/success", "/meet/success"],
    },
    sitemap: "https://realreselling.com/sitemap.xml",
  };
}
