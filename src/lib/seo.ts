import type { Metadata } from "next";
import { defaultKeywords, siteConfig } from "@/data/site";

export const fullUrl = (pathName = "") => {
  const base = siteConfig.url.replace(/\/$/, "");
  const path = pathName.startsWith("/") ? pathName : `/${pathName}`;
  return `${base}${path === "/" ? "" : path}`;
};

const defaultOgImageUrl = fullUrl(siteConfig.image);
const twitterUsername = siteConfig.social.twitter.split("/").filter(Boolean).pop();
const twitterHandle = twitterUsername ? `@${twitterUsername.replace(/^@/, "")}` : undefined;

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
    authors: [{ name: siteConfig.name }],
    openGraph: {
      title: `${siteConfig.name} | ${siteConfig.role}`,
      description: siteConfig.description,
      url: siteConfig.url,
      siteName: siteConfig.shortName,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: "/dev-ed-wave.png",
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} portfolio preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} | ${siteConfig.role}`,
      description: siteConfig.description,
      images: ["/dev-ed-wave.png"],
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
    siteName: siteConfig.shortName,
    locale: siteConfig.locale,
    images: [
      {
        url: defaultOgImageUrl,
        width: 1200,
        height: 630,
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
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    email: siteConfig.email,
    url: siteConfig.url,
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
    ],
    knowsAbout: defaultKeywords,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.shortName,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/blog?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
