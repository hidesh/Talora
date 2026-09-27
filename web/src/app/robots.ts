import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login", "/api/", "/auth/", "/reset-adgangskode", "/privatliv", "/privatliv_test"],
    },
    sitemap: "https://talora.dk/sitemap.xml",
    host: "https://talora.dk",
  };
}
