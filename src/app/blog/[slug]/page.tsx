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
    <article className="pb-32">
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

      <header className="pt-32 pb-16 border-b border-border/40 relative">
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] font-medium uppercase text-muted-foreground hover:text-primary transition-colors mb-16"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Writing
        </Link>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-foreground mb-12 max-w-[15ch]">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium mb-12">
          <time dateTime={new Date(post.date).toISOString()}>{formatDate(post.date)}</time>
          <span className="w-8 h-[1px] bg-primary/20 block"></span>
          <span>{post.readtime}</span>
          <span className="w-8 h-[1px] bg-primary/20 block"></span>
          <span>By {siteConfig.name}</span>
        </div>
      </header>

      <div className="py-16 md:py-24 max-w-4xl">
        <MarkdownContent content={post.content} />
      </div>

      <section className="py-12 border-t border-border/40">
        <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground mb-8">Share Article</h2>
        <ShareLinks title={post.title} url={shareUrl} />
      </section>

      <section className="pt-24 pb-12 border-t border-border/40 mt-12">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black tracking-tighter uppercase text-foreground">Next Article</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-border/40">
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
