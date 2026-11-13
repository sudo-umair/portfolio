import type { MetadataRoute } from "next";
import { projects } from "@portfolio/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/about", "/contact", ...projects.map((project) => `/work/${project.slug}`)];
  return paths.map((path) => ({ url: new URL(path, site.url).href }));
}
