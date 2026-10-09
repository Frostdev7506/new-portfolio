import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getAllPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/projects",
    "/about",
    "/contact",
    "/blog",
    "/resume",
    "/privacy",
    "/editorial-policy",
  ].map((path) => ({
    url: siteConfig.url + path,
    changeFrequency: path === "" || path === "/blog" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: siteConfig.url + "/blog/" + post.slug,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [...staticPages, ...blogPages];
}
