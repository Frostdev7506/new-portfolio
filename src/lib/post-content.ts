import matter from "gray-matter";
import { getArticleStructure } from "./article-content.ts";
import { validateAdvancedSeo, validateArticleDates, validateCanonicalUrl, validateCoverDimensions, validateSocialImage } from "./blog-seo-validation.ts";

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
  const optional = (key: string) =>
    data[key] === undefined ? undefined : required(key);
  const dateField = (key: string) => data[key] instanceof Date
    ? data[key].toISOString().slice(0, 10)
    : required(key);
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
  const coverWidth: unknown = data.coverWidth;
  const coverHeight: unknown = data.coverHeight;
  const sourceUrl = data.source ? required("source") : undefined;
  if (
    sourceUrl &&
    !/^https:\/\/(www\.)?(linkedin\.com|lnkd\.in)\//.test(sourceUrl)
  )
    throw new Error(`${fileName}: invalid LinkedIn source`);
  const date = dateField("date");
  const updated = data.updated ? dateField("updated") : date;
  const youtubeId =
    data.youtubeId === undefined ? undefined : required("youtubeId");
  if (youtubeId && !/^[A-Za-z0-9_-]{11}$/.test(youtubeId))
    throw new Error(`${fileName}: invalid youtubeId`);
  const seoTitle = optional("seoTitle");
  const seoDescription = optional("seoDescription");
  const canonicalUrl = optional("canonicalUrl");
  const ogTitle = optional("ogTitle");
  const ogDescription = optional("ogDescription");
  const ogImage = optional("ogImage");
  const ogImageAlt = optional("ogImageAlt");
  const twitterTitle = optional("twitterTitle");
  const twitterDescription = optional("twitterDescription");
  const twitterImage = optional("twitterImage");
  const twitterImageAlt = optional("twitterImageAlt");
  try {
    validateAdvancedSeo(data);
    validateCoverDimensions(coverWidth, coverHeight);
    validateArticleDates(date, updated);
    if (canonicalUrl) validateCanonicalUrl(canonicalUrl);
    if (ogImage) validateSocialImage(ogImage, ogImageAlt ?? "");
    if (twitterImage) validateSocialImage(twitterImage, twitterImageAlt ?? "", "twitterImage");
  } catch (error) {
    throw new Error(`${fileName}: ${error instanceof Error ? error.message : "Invalid article settings"}`);
  }
  return {
    slug,
    title: required("title"),
    seoTitle,
    seoDescription,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage,
    ogImageAlt,
    noindex: data.noindex === true,
    nofollow: data.nofollow as boolean | undefined,
    nosnippet: data.nosnippet as boolean | undefined,
    maxSnippet: data.maxSnippet as number | undefined,
    maxImagePreview: data.maxImagePreview as "none" | "standard" | "large" | undefined,
    maxVideoPreview: data.maxVideoPreview as number | undefined,
    twitterCard: data.twitterCard as "summary" | "summary_large_image" | undefined,
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterImageAlt,
    youtubeId,
    description: required("description"),
    category: required("category"),
    takeaway: required("takeaway"),
    cover,
    coverAlt: required("coverAlt"),
    ...(typeof coverWidth === "number" && typeof coverHeight === "number"
      ? { coverWidth, coverHeight }
      : {}),
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
