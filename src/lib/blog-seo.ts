import type { Metadata } from "next";

type BlogSeoSite = {
  url: string;
  name: string;
  locale: string;
  language?: string;
  social?: { twitter?: string };
};

type BlogSeoPost = {
  slug: string;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  noindex?: boolean;
  nofollow?: boolean;
  nosnippet?: boolean;
  maxSnippet?: number;
  maxImagePreview?: "none" | "standard" | "large";
  maxVideoPreview?: number;
  twitterCard?: "summary" | "summary_large_image";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
  draft?: boolean;
  cover: string;
  coverAlt: string;
  coverWidth?: number;
  coverHeight?: number;
  date: string;
  updated: string;
  tags: string[];
  category: string;
  wordCount: number;
};

type BlogAppearancePost = Pick<BlogSeoPost,
  "title" | "description" | "seoTitle" | "seoDescription" | "ogTitle" | "ogDescription" |
  "ogImage" | "ogImageAlt" | "twitterCard" | "twitterTitle" | "twitterDescription" |
  "twitterImage" | "twitterImageAlt" | "cover" | "coverAlt"
>;

function getTwitterCreator(profile?: string): string | undefined {
  if (!profile) return undefined;
  try {
    const url = new URL(profile);
    if (url.protocol !== "https:" || url.username || url.password || !["twitter.com", "www.twitter.com", "x.com", "www.x.com"].includes(url.hostname)) return undefined;
    const handle = /^\/([A-Za-z0-9_]{1,15})\/?$/.exec(url.pathname)?.[1];
    if (!handle || ["home", "explore", "notifications", "messages", "search", "settings", "compose", "intent", "i", "share", "login", "signup"].includes(handle.toLowerCase())) return undefined;
    return `@${handle}`;
  } catch {
    return undefined;
  }
}

function getCoverDimensions(post: Pick<BlogSeoPost, "coverWidth" | "coverHeight">) {
  return post.coverWidth !== undefined && post.coverHeight !== undefined
    ? { width: post.coverWidth, height: post.coverHeight }
    : {};
}

export function resolveBlogAppearance(post: BlogAppearancePost, site: Pick<BlogSeoSite, "url" | "name" | "social">) {
  const siteUrl = site.url.replace(/\/+$/, "");
  const absoluteUrl = (value: string) => new URL(value, `${siteUrl}/`).href;
  const title = post.seoTitle?.trim() || `${post.title} | ${site.name}`;
  const description = post.seoDescription?.trim() || post.description;
  const social = {
    title: post.ogTitle?.trim() || title,
    description: post.ogDescription?.trim() || description,
    image: absoluteUrl(post.ogImage?.trim() || post.cover),
    imageAlt: post.ogImageAlt?.trim() || post.coverAlt,
  };
  const creator = getTwitterCreator(site.social?.twitter);
  const twitter = {
    title: post.twitterTitle?.trim() || social.title,
    description: post.twitterDescription?.trim() || social.description,
    image: post.twitterImage?.trim() ? absoluteUrl(post.twitterImage.trim()) : social.image,
    imageAlt: post.twitterImageAlt?.trim() || social.imageAlt,
    card: post.twitterCard ?? "summary_large_image",
    ...(creator ? { creator } : {}),
  };
  return { title, description, social, twitter };
}

export function resolveBlogSeo(post: BlogSeoPost, site: BlogSeoSite) {
  const siteUrl = site.url.replace(/\/+$/, "");
  const absoluteUrl = (value: string) => new URL(value, `${siteUrl}/`).href;
  const permalink = absoluteUrl(`/blog/${post.slug}`);
  const canonicalUrl = absoluteUrl(post.canonicalUrl?.trim() || permalink);
  const { title, description, social, twitter } = resolveBlogAppearance(post, site);
  const indexable = !post.noindex && !post.draft;
  const robots = {
    index: indexable,
    follow: !post.nofollow,
    ...(post.nosnippet ? { nosnippet: true } : {}),
    ...(!post.nosnippet && post.maxVideoPreview !== undefined ? { "max-video-preview": post.maxVideoPreview } : {}),
    "max-image-preview": post.maxImagePreview ?? "large",
    ...(!post.nosnippet && post.maxSnippet !== undefined ? { "max-snippet": post.maxSnippet } : {}),
  };
  // Keep this order aligned with Next's robots metadata serialization.
  const robotsContent = [
    indexable ? "index" : "noindex",
    robots.follow ? "follow" : "nofollow",
    ...(robots.nosnippet ? ["nosnippet"] : []),
    ...(robots["max-video-preview"] !== undefined ? [`max-video-preview:${robots["max-video-preview"]}`] : []),
    `max-image-preview:${robots["max-image-preview"]}`,
    ...(robots["max-snippet"] !== undefined ? [`max-snippet:${robots["max-snippet"]}`] : []),
  ].join(", ");
  const publishedTime = new Date(post.date).toISOString();
  const modifiedTime = new Date(post.updated).toISOString();
  const authorUrl = absoluteUrl("/about");
  const author = {
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: site.name,
    url: authorUrl,
  };
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${permalink}#article`,
      url: canonicalUrl,
      headline: post.title,
      description: post.description,
      datePublished: publishedTime,
      dateModified: modifiedTime,
      author,
      publisher: author,
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
      isPartOf: { "@type": "Blog", "@id": absoluteUrl("/blog#blog") },
      image: {
        "@type": "ImageObject",
        url: absoluteUrl(post.cover),
        description: post.coverAlt,
        ...getCoverDimensions(post),
      },
      keywords: post.tags.join(", "),
      wordCount: post.wordCount,
      articleSection: post.category,
      inLanguage: site.language || site.locale.replace(/_/g, "-"),
      isAccessibleForFree: true,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${permalink}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
        { "@type": "ListItem", position: 3, name: post.title, item: permalink },
      ],
    },
  ] as const;
  return {
    title,
    description,
    canonicalUrl,
    permalink,
    social,
    twitter,
    robots,
    robotsContent,
    publishedTime,
    modifiedTime,
    authorUrl,
    jsonLd,
  };
}

export function buildBlogMetadata(post: BlogSeoPost, site: BlogSeoSite): Metadata {
  const seo = resolveBlogSeo(post, site);
  const coverUrl = new URL(post.cover, `${site.url.replace(/\/+$/, "")}/`).href;
  const dimensions = getCoverDimensions(post);
  return {
    title: post.seoTitle?.trim() ? { absolute: seo.title } : post.title,
    description: seo.description,
    keywords: [...post.tags, site.name],
    authors: [{ name: site.name, url: seo.authorUrl }],
    creator: site.name,
    publisher: site.name,
    category: post.category,
    alternates: {
      canonical: seo.canonicalUrl,
      types: { "application/rss+xml": new URL("/feed.xml", site.url).href },
    },
    // Override the layout's Googlebot defaults with the article's exact policy.
    robots: { ...seo.robots, googleBot: seo.robots },
    openGraph: {
      type: "article",
      title: seo.social.title,
      description: seo.social.description,
      url: seo.canonicalUrl,
      siteName: site.name,
      locale: site.locale,
      publishedTime: seo.publishedTime,
      modifiedTime: seo.modifiedTime,
      authors: [seo.authorUrl],
      section: post.category,
      tags: post.tags,
      images: [{
        url: seo.social.image,
        alt: seo.social.imageAlt,
        ...(seo.social.image === coverUrl ? dimensions : {}),
      }],
    },
    twitter: {
      card: seo.twitter.card,
      ...(seo.twitter.creator ? { creator: seo.twitter.creator } : {}),
      title: seo.twitter.title,
      description: seo.twitter.description,
      images: [{
        url: seo.twitter.image,
        alt: seo.twitter.imageAlt,
        ...(seo.twitter.image === coverUrl ? dimensions : {}),
      }],
    },
  };
}

export function isBlogPostInSitemap(post: BlogSeoPost, site: BlogSeoSite) {
  if (post.noindex || post.draft) return false;
  const { canonicalUrl, permalink } = resolveBlogSeo(post, site);
  const normalized = (value: string) => {
    const url = new URL(value);
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return url.href;
  };
  return normalized(canonicalUrl) === normalized(permalink);
}
