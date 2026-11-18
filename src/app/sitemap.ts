import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/company";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/products", "/process", "/why-us", "/contact"];
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
