import matter from "gray-matter";
import { getArticleStructure } from "./article-content.ts";

export type BlogPost = ReturnType<typeof parsePost>;
export type PostSummary = Omit<BlogPost, "content" | "headings">;

export function parsePost(source: string, fileName: string) {
  const { data, content } = matter(source);
  const required = (key: string) => {
    const value = data[key];
    if (typeof value !== "string" || !value.trim())
      throw new Error(`${fileName}: missing ${key}`);
    return value.trim();
  };
  const dateField = (key: string) => {
    const value =
      data[key] instanceof Date
        ? data[key].toISOString().slice(0, 10)
        : required(key);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      !Number.isFinite(Date.parse(value)) ||
      new Date(value).toISOString().slice(0, 10) !== value
    ) {
      throw new Error(`${fileName}: invalid ${key}`);
    }
    return value;
  };
  const slug = fileName.replace(/\.md$/, "");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw new Error(`${fileName}: invalid slug`);
  const tags = Array.isArray(data.tags) ? data.tags : [];
  if (
    !tags.length ||
    tags.some((tag) => typeof tag !== "string" || !tag.trim())
  )
    throw new Error(`${fileName}: tags must be a nonempty list`);
  const cover = required("cover");
  if (!cover.startsWith("/illustrations/") || cover.includes(".."))
    throw new Error(`${fileName}: cover must be a local illustration`);
  const sourceUrl = data.source ? required("source") : undefined;
  if (
    sourceUrl &&
    !/^https:\/\/(www\.)?(linkedin\.com|lnkd\.in)\//.test(sourceUrl)
  )
    throw new Error(`${fileName}: invalid LinkedIn source`);
  const date = dateField("date");
  const updated = data.updated ? dateField("updated") : date;
  if (updated < date)
    throw new Error(`${fileName}: updated precedes publication`);
  return {
    slug,
    title: required("title"),
    description: required("description"),
    category: required("category"),
    takeaway: required("takeaway"),
    cover,
    coverAlt: required("coverAlt"),
    date,
    updated,
    tags: tags.map((tag: string) => tag.trim()),
    source: sourceUrl,
    draft: data.draft === true,
    content,
    ...getArticleStructure(content),
  };
}

export function toPostSummary({
  content: _content,
  headings: _headings,
  ...summary
}: BlogPost): PostSummary {
  void _content;
  void _headings;
  return summary;
}

export function selectRelatedPosts(
  posts: PostSummary[],
  current: PostSummary,
  limit = 3,
) {
  const score = (post: PostSummary) =>
    post.tags.filter((tag) => current.tags.includes(tag)).length +
    Number(post.category === current.category);
  return posts
    .filter((post) => post.slug !== current.slug && !post.draft)
    .sort(
      (a, b) =>
        score(b) - score(a) ||
        b.date.localeCompare(a.date) ||
        a.slug.localeCompare(b.slug),
    )
    .slice(0, limit);
}
