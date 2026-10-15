import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { ShareLinks } from "@/components/blog/share-links";
import { ArticleNavigation } from "@/components/blog/article-navigation";
import { YouTubeVideo } from "@/components/blog/youtube-video";
import { siteConfig } from "@/data/site";
import { fullUrl } from "@/lib/seo";
import {
  getAllPosts,
  getBlogPostUrl,
  getPostBySlug,
  getPostSlugs,
  selectRelatedPosts,
  toPostSummary,
} from "@/lib/posts";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };
const authorUrl = fullUrl("/about");
export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return { title: "Post not found" };
  const coverImage = {
    url: fullUrl(post.cover),
    alt: post.coverAlt,
    ...(post.coverWidth !== undefined && post.coverHeight !== undefined
      ? { width: post.coverWidth, height: post.coverHeight }
      : {}),
  };
  return {
    title: post.seoTitle ? { absolute: post.seoTitle } : post.title,
    description: post.description,
    authors: [{ name: siteConfig.name, url: authorUrl }],
    keywords: [...post.tags, siteConfig.name],
    alternates: {
      canonical: `/blog/${post.slug}`,
      types: { "application/rss+xml": "/feed.xml" },
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      siteName: siteConfig.shortName,
      locale: siteConfig.locale,
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.updated).toISOString(),
      authors: [authorUrl],
      tags: post.tags,
      images: [coverImage],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [coverImage],
    },
  };
}
export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();
  const related = selectRelatedPosts(
    (await getAllPosts()).map(toPostSummary),
    toPostSummary(post),
  );
  const shareUrl = getBlogPostUrl(post.slug);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: new Date(post.date).toISOString(),
      dateModified: new Date(post.updated).toISOString(),
      author: {
        "@type": "Person",
        name: siteConfig.name,
        url: authorUrl,
      },
      mainEntityOfPage: shareUrl,
      image: {
        "@type": "ImageObject",
        url: fullUrl(post.cover),
        description: post.coverAlt,
        ...(post.coverWidth !== undefined && post.coverHeight !== undefined
          ? { width: post.coverWidth, height: post.coverHeight }
          : {}),
      },
      inLanguage: siteConfig.language,
      keywords: post.tags.join(", "),
      wordCount: post.wordCount,
      articleSection: post.category,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${siteConfig.url}/blog`,
        },
        { "@type": "ListItem", position: 3, name: post.title, item: shareUrl },
      ],
    },
  ];
  return (
    <article className="article-page" id="article-top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <header className="article-header">
        <Link href="/blog" className="article-back">
          <ArrowLeft aria-hidden="true" /> All articles
        </Link>
        <p className="article-category">{post.category}</p>
        <h1>{post.title}</h1>
        <p className="article-deck">{post.description}</p>
        <div className="article-byline">
          <Link href="/about">{siteConfig.name}</Link>
          <span aria-hidden="true">·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readtime}</span>
        </div>
        {post.updated !== post.date && (
          <p className="article-updated">
            Updated{" "}
            <time dateTime={post.updated}>{formatDate(post.updated)}</time>
          </p>
        )}
        {post.youtubeId ? (
          <YouTubeVideo
            key={post.youtubeId}
            videoId={post.youtubeId}
            title={post.title}
          />
        ) : (
          <figure className="article-cover">
            <Image
              src={post.cover}
              alt={post.coverAlt}
              width={post.coverWidth ?? 1536}
              height={post.coverHeight ?? 1024}
              sizes="(max-width: 480px) 100vw, 420px"
              priority
            />
          </figure>
        )}
      </header>
      <div className="article-reading-layout">
        <ArticleNavigation headings={post.headings} />
        <div className="article-body">
          <div id="article-content">
            <MarkdownContent content={post.content} />
          </div>
          {post.source && (
            <p className="article-origin">
              Adapted from my{" "}
              <a href={post.source} target="_blank" rel="noreferrer noopener">
                original LinkedIn post <ArrowUpRight aria-hidden="true" />
              </a>
              .
            </p>
          )}
          <section className="article-share" aria-label="Share this article">
            <p>Share</p>
            <ShareLinks title={post.title} url={shareUrl} />
          </section>
          {!!related.length && (
            <section className="article-related" aria-labelledby="related-title">
              <h2 id="related-title">More to read</h2>
              <ul>
                {related.map((candidate) => (
                  <li key={candidate.slug}>
                    <Link href={`/blog/${candidate.slug}`}>
                      {candidate.title}
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                    <p>
                      {candidate.category} · {candidate.readtime}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
