import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = ["", "/about", "/achievements", "/merch", "/blog", "/contact", "/apply"].map((p) => ({ url: `${site.url}${p}`, lastModified: now }));
  const posts = (await getAllPosts()).map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: new Date(p.date) }));
  return [...pages, ...posts];
}
