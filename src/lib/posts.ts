import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { siteConfig } from "@/data/site";
import { parsePost } from "./post-content";
export { toPostSummary, selectRelatedPosts } from "./post-content";
export type { BlogPost, PostSummary } from "./post-content";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export const getAllPosts = cache(async () => {
  const files = (await fs.readdir(postsDirectory)).filter((file) =>
    file.endsWith(".md"),
  );
  const posts = await Promise.all(
    files.map(async (file) =>
      parsePost(
        await fs.readFile(path.join(postsDirectory, file), "utf8"),
        file,
      ),
    ),
  );
  return posts
    .filter((post) => !post.draft)
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
    );
});

export async function getPostBySlug(slug: string) {
  return (await getAllPosts()).find((post) => post.slug === slug) ?? null;
}

export async function getPostSlugs() {
  return (await getAllPosts()).map((post) => post.slug);
}

export async function getRecentPosts(limit = 2) {
  return (await getAllPosts()).slice(0, limit);
}

export function getBlogPostUrl(slug: string) {
  return `${siteConfig.url}/blog/${slug}`;
}
