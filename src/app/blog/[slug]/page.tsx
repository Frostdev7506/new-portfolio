import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { ShareLinks } from "@/components/blog/share-links";
import { ArticleNavigation } from "@/components/blog/article-navigation";
import { YouTubeVideo } from "@/components/blog/youtube-video";
import { ArticleUpdates } from "@/components/shared/article-updates";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { siteConfig } from "@/data/site";
import {
  getAllPosts,
  getBlogPostUrl,
  getPostBySlug,
  getPostSlugs,
  selectRelatedPosts,
  toPostSummary,
} from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { buildBlogMetadata, resolveBlogSeo } from "@/lib/blog-seo";
import { serializeJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return { title: "Post not found" };
  return buildBlogMetadata(post, siteConfig);
}
export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();
  const related = selectRelatedPosts(
    (await getAllPosts()).map(toPostSummary),
    toPostSummary(post),
  );
  const shareUrl = getBlogPostUrl(post.slug);
  const { jsonLd } = resolveBlogSeo(post, siteConfig);
  const breadcrumbItems = jsonLd[1].itemListElement.map(({ name, item }) => ({
    name,
    href: new URL(item).pathname,
  }));
  return (
    <article className="article-page" id="article-top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <Breadcrumbs items={breadcrumbItems} includeJsonLd={false} />
      <header className="article-header">
        <div className="article-header-copy">
          <p className="article-category">{post.category}</p>
          <h1>{post.title}</h1>
          <p className="article-deck">{post.description}</p>
          <div className="article-byline">
            <Link href="/about">{siteConfig.name}</Link>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.readtime}</span>
          </div>
          {post.updated !== post.date && (
            <p className="article-updated">
              Updated{" "}
              <time dateTime={post.updated}>{formatDate(post.updated)}</time>
            </p>
          )}
        </div>
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
              sizes="(max-width: 700px) 90vw, 420px"
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
          <ArticleUpdates />
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
