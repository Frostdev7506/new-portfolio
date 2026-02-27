import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { siteConfig } from "@/data/site";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export type BlogPost = {
  title: string;
  date: string;
  slug: string;
  readtime: string;
  tags: string[];
  description: string;
  content: string;
};

type RawFrontmatter = {
  title?: string | Date;
  date?: string | Date;
  slug?: string;
  readtime?: string;
  tags?: string | string[];
  description?: string;
};

const cleanSlug = (value: string) => value.trim().replace(/\s+/g, "-");

const normalizeText = (value: string | Date | undefined) => {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value.trim();
};

const normalizeDate = (value: string | Date | undefined) => {
  if (!value) {
    return "2023-01-01";
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value.trim();
};

const normalizeTags = (value: string | string[] | undefined) => {
  if (!value) {
    return ["Engineering"];
  }

  if (Array.isArray(value)) {
    return value.map((tag) => tag.trim()).filter(Boolean);
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const estimateReadTime = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

const createDescription = (content: string) => {
  const text = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*_`~\-\[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text.slice(0, 160);
};

async function getPostFiles() {
  const files = await fs.readdir(postsDirectory);
  return files.filter((file) => file.endsWith(".md"));
}

async function parsePostFromFile(fileName: string): Promise<BlogPost> {
  const filePath = path.join(postsDirectory, fileName);
  const source = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(source);
  const frontmatter = data as RawFrontmatter;

  const fileSlug = fileName.replace(/\.md$/, "");
  const slug = cleanSlug(frontmatter.slug || fileSlug);
  const title = normalizeText(frontmatter.title) || fileSlug;
  const date = normalizeDate(frontmatter.date);
  const readtime = normalizeText(frontmatter.readtime) || estimateReadTime(content);
  const tags = normalizeTags(frontmatter.tags);

  return {
    slug,
    title,
    date,
    readtime,
    tags,
    description: frontmatter.description?.trim() || createDescription(content),
    content,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const files = await getPostFiles();
  const posts = await Promise.all(files.map(parsePostFromFile));

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}

export async function getRecentPosts(limit = 2): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}

export function getBlogPostUrl(slug: string) {
  return `${siteConfig.url}/blog/${slug}`;
}
