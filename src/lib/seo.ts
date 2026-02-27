import type { Metadata } from "next";
import { defaultKeywords, siteConfig } from "@/data/site";

export const fullUrl = (pathName = "") => {
  if (/^https?:\/\//i.test(pathName)) {
    return pathName;
  }

  const base = siteConfig.url.replace(/\/$/, "");
  const path = pathName.startsWith("/") ? pathName : `/${pathName}`;
  return `${base}${path === "/" ? "" : path}`;
};

const defaultOgImageUrl = fullUrl(siteConfig.image);
const resumePdfUrl = fullUrl(siteConfig.resumeUrl);
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
    keywords: mergeKeywords(siteConfig.skills),
    category: "technology",
    creator: siteConfig.name,
    publisher: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    referrer: "origin-when-cross-origin",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: `${siteConfig.name} | ${siteConfig.role}`,
      description: siteConfig.description,
      url: siteConfig.url,
      siteName: siteConfig.shortName,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: defaultOgImageUrl,
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
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    other: {
      "theme-color": "#090c10",
      "color-scheme": "dark",
    },
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
    description: siteConfig.description,
    jobTitle: siteConfig.role,
    email: siteConfig.email,
    url: siteConfig.url,
    image: defaultOgImageUrl,
    address: {
      "@type": "PostalAddress",
      addressCountry: siteConfig.location,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "professional inquiries",
        email: siteConfig.email,
        availableLanguage: [siteConfig.language],
      },
    ],
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
    ],
    subjectOf: {
      "@type": "CreativeWork",
      name: `${siteConfig.name} Resume`,
      url: resumePdfUrl,
      encodingFormat: "application/pdf",
    },
    knowsAbout: defaultKeywords,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.shortName,
    url: siteConfig.url,
    logo: defaultOgImageUrl,
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
    ],
    founder: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.shortName,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    publisher: {
      "@type": "Organization",
      name: siteConfig.shortName,
      url: siteConfig.url,
    },
    about: {
      "@type": "Person",
      name: siteConfig.name,
      jobTitle: siteConfig.role,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${fullUrl("/blog")}?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
