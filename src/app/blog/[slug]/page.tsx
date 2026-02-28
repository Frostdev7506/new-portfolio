import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { ShareLinks } from "@/components/blog/share-links";
import { siteConfig } from "@/data/site";
import { getBlogPostUrl, getPostBySlug, getPostSlugs, getRecentPosts } from "@/lib/posts";
import { buildPageMetadata, fullUrl } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
      description: "The requested article is unavailable.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const publishedTime = new Date(post.date).toISOString();
  const metadata = buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: [...post.tags, siteConfig.name, "engineering blog"],
    type: "article",
    publishedTime,
    modifiedTime: publishedTime,
    tags: post.tags,
  });

  return {
    ...metadata,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "technology",
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const recentPosts = await getRecentPosts(2);

  const shareUrl = getBlogPostUrl(post.slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.shortName,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: fullUrl(siteConfig.image),
      },
    },
    mainEntityOfPage: shareUrl,
    image: [fullUrl(siteConfig.image)],
    keywords: post.tags.join(", "),
    isPartOf: {
      "@type": "Blog",
      name: `${siteConfig.name} Blog`,
      url: `${siteConfig.url}/blog`,
    },
  };

  const breadcrumbJsonLd = {
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
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: shareUrl,
      },
    ],
  };

  return (
    <article className="space-y-8">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <header className="space-y-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:text-slate-900 dark:bg-slate-900 dark:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <time dateTime={new Date(post.date).toISOString()}>{formatDate(post.date)}</time>
          <span>•</span>
          <span>{post.readtime}</span>
          <span>•</span>
          <span>By {siteConfig.name}</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Written from applied work across MERN and cloud delivery with focus on production reliability, performance, and release quality.
        </p>
      </header>

      <div className="rounded-3xl border border-border bg-white px-6 py-8 shadow-sm dark:bg-slate-900 md:px-8 md:py-10">
        <MarkdownContent content={post.content} />
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Share This Article</h2>
        <ShareLinks title={post.title} url={shareUrl} />
      </section>

      <section className="space-y-4 rounded-3xl border border-border bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Recent Articles</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {recentPosts
            .filter((candidate) => candidate.slug !== post.slug)
            .slice(0, 2)
            .map((candidate) => (
              <BlogPostCard key={candidate.slug} post={candidate} />
            ))}
        </div>
      </section>
    </article>
  );
}
