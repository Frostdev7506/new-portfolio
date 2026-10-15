import type { Metadata } from "next";
import { defaultKeywords, siteConfig } from "../data/site.ts";
import type { BlogPost, PostSummary } from "./post-content.ts";

export const fullUrl = (pathName = "") => {
  const base = siteConfig.url.replace(/\/$/, "");
  const path = pathName.startsWith("/") ? pathName : `/${pathName}`;
  return `${base}${path === "/" ? "" : path}`;
};

const defaultOgImageUrl = fullUrl(siteConfig.image);
const twitterUsername = siteConfig.social.twitter.split("/").filter(Boolean).pop();
const twitterHandle = twitterUsername ? `@${twitterUsername.replace(/^@/, "")}` : undefined;
const author = {
  "@type": "Person",
  "@id": fullUrl("/#person"),
  name: siteConfig.name,
  url: fullUrl("/about"),
};

export const serializeJsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

const mergeKeywords = (keywords: string[] = []) => {
  return Array.from(
    new Set(
      [...defaultKeywords, ...keywords]
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    ),
  );
};

export function baseMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.shortName,
    title: {
      default: `${siteConfig.name} | ${siteConfig.role}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: defaultKeywords,
    category: "technology",
    creator: siteConfig.name,
    authors: [{ name: siteConfig.name, url: fullUrl("/about") }],
    publisher: siteConfig.name,
    robots: {
      googleBot: {
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: `${siteConfig.name} | ${siteConfig.role}`,
      description: siteConfig.description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: defaultOgImageUrl,
          width: 1000,
          height: 750,
          alt: `${siteConfig.name} portfolio preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} | ${siteConfig.role}`,
      description: siteConfig.description,
      images: [defaultOgImageUrl],
      creator: twitterHandle,
    },
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
    manifest: "/manifest.webmanifest",
    ...overrides,
  };
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
  tags = [],
}: PageMetadataInput): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = fullUrl(canonicalPath);
  const mergedKeywords = mergeKeywords(keywords);

  const openGraphBase = {
    title,
    description,
    url: canonicalUrl,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [
      {
        url: defaultOgImageUrl,
        width: 1000,
        height: 750,
        alt: `${siteConfig.name} portfolio preview`,
      },
    ],
  };

  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          ...openGraphBase,
          type: "article",
          publishedTime,
          modifiedTime,
          tags,
        }
      : {
          ...openGraphBase,
          type: "website",
        };

  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImageUrl],
      creator: twitterHandle,
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    ...author,
    jobTitle: siteConfig.role,
    description: siteConfig.longDescription,
    email: siteConfig.email,
    sameAs: Object.values(siteConfig.social),
    knowsAbout: siteConfig.skills,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": fullUrl("/#website"),
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    author,
    publisher: author,
  };
}

export function buildPostMetadata(post: BlogPost): Metadata {
  const image = {
    url: fullUrl(post.cover),
    alt: post.coverAlt,
    ...(post.coverWidth !== undefined && post.coverHeight !== undefined
      ? { width: post.coverWidth, height: post.coverHeight }
      : {}),
  };
  return {
    title: post.seoTitle ? { absolute: post.seoTitle } : post.title,
    description: post.description,
    authors: [{ name: author.name, url: author.url }],
    creator: author.name,
    publisher: author.name,
    category: post.category,
    keywords: post.tags,
    alternates: {
      canonical: fullUrl(`/blog/${post.slug}`),
      types: { "application/rss+xml": "/feed.xml" },
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: fullUrl(`/blog/${post.slug}`),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.updated).toISOString(),
      authors: [author.url],
      section: post.category,
      tags: post.tags,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: twitterHandle,
      images: [image],
    },
  };
}

export function blogPostJsonLd(post: BlogPost) {
  const url = fullUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.updated).toISOString(),
    author,
    publisher: author,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@type": "Blog", "@id": fullUrl("/blog#blog") },
    image: {
      "@type": "ImageObject",
      url: fullUrl(post.cover),
      description: post.coverAlt,
      ...(post.coverWidth !== undefined && post.coverHeight !== undefined
        ? { width: post.coverWidth, height: post.coverHeight }
        : {}),
    },
    inLanguage: siteConfig.language,
    isAccessibleForFree: true,
    keywords: post.tags.join(", "),
    wordCount: post.wordCount,
    articleSection: post.category,
  };
}

export function blogJsonLd(posts: PostSummary[], description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": fullUrl("/blog#blog"),
    url: fullUrl("/blog"),
    name: `${siteConfig.name}’s blog`,
    description,
    inLanguage: siteConfig.language,
    isPartOf: { "@id": fullUrl("/#website") },
    author,
    publisher: author,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": fullUrl(`/blog/${post.slug}#article`),
      url: fullUrl(`/blog/${post.slug}`),
      headline: post.title,
    })),
  };
}

export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": fullUrl("/about#profile"),
    url: fullUrl("/about"),
    name: `About ${siteConfig.name}`,
    isPartOf: { "@id": fullUrl("/#website") },
    mainEntity: author,
  };
}
