import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/saadan-arbejder-vi", "/samarbejdspartnere", "/book-moede", "/forretningsbetingelser"];
  return routes.map((route, index) => ({ url: `https://talora.dk${route}`, lastModified: new Date(), changeFrequency: index === 0 ? "weekly" : "monthly", priority: index === 0 ? 1 : route === "/book-moede" ? 0.9 : 0.7 }));
}
