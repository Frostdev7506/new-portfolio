import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getAllPosts } from "@/lib/posts";
import { isBlogPostInSitemap, resolveBlogSeo } from "@/lib/blog-seo";

const staticPaths = [
  "",
  "/projects",
  "/about",
  "/contact",
  "/blog",
  "/resume",
  "/privacy",
  "/editorial-policy",
  "/llms.txt",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = staticPaths.map((path) => {
    const isHomePage = path === "";
    const updatesWeekly = isHomePage || path === "/blog";

    return {
      url: siteConfig.url + path,
      changeFrequency: updatesWeekly ? "weekly" : "monthly",
      priority: isHomePage ? 1 : 0.8,
    };
  });

  const posts = await getAllPosts();
  const blogPages: MetadataRoute.Sitemap = posts
    .filter((post) => isBlogPostInSitemap(post, siteConfig))
    .map((post) => ({
      url: resolveBlogSeo(post, siteConfig).permalink,
      lastModified: new Date(post.updated),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticPages, ...blogPages];
}
