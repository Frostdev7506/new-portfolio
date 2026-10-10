import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { ShareLinks } from "@/components/blog/share-links";
import { siteConfig } from "@/data/site";
import {
  getBlogPostUrl,
  getPostBySlug,
  getPostSlugs,
  getRecentPosts,
} from "@/lib/posts";
import { formatDate } from "@/lib/utils";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: [...post.tags, siteConfig.name, "engineering blog"],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: new Date(post.date).toISOString(),
      tags: post.tags,
      images: [
        {
          url: "/dev-ed-wave.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/dev-ed-wave.png"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const recentPosts = await getRecentPosts(3);

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
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.name,
    },
    mainEntityOfPage: shareUrl,
    image: [`${siteConfig.url}/dev-ed-wave.png`],
    keywords: post.tags.join(", "),
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
    <article className="article-page">
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

      <header>
        <Link href="/blog" className="text-link">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <h1>{post.title}</h1>

        <div className="post-meta">
          <span>{formatDate(post.date)}</span>
          <span>•</span>
          <span>{post.readtime}</span>
        </div>
      </header>

      <div className="article-body">
        <MarkdownContent content={post.content} />
      </div>

      <section className="article-section">
        <h2>Share This Article</h2>
        <ShareLinks title={post.title} url={shareUrl} />
      </section>

      <section className="article-section">
        <h2>Recent Articles</h2>
        <div>
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
