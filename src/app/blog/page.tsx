import { FeaturedArticle } from "@/components/blog/featured-article";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import { PageIntro } from "@/components/shared/page-intro";
import { getAllPosts, toPostSummary } from "@/lib/posts";
import { blogJsonLd, buildPageMetadata, serializeJsonLd } from "@/lib/seo";
import { notebook } from "@/data/notebook";
import { siteConfig } from "@/data/site";

export const metadata = {
  ...buildPageMetadata({
    title: "Blog",
    description: notebook.blogDescription,
    path: "/blog",
  }),
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default async function BlogPage() {
  const posts = (await getAllPosts()).map(toPostSummary);
  const featured =
    posts.find((post) => post.slug === notebook.featuredSlug) ?? posts[0];
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteConfig.url}/blog`,
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([blogJsonLd(posts, notebook.blogDescription), breadcrumb]),
        }}
      />
      <PageIntro
        className="blog-intro"
        eyebrow="Blog"
        title="Things worth writing down."
        description={notebook.blogDescription}
        image="/illustrations/blog-notebooks.png"
      />
      {featured && <FeaturedArticle post={featured} />}
      <BlogExplorer posts={posts} />
      <div className="notebook-end">
        <span className="handwritten">
          Always learning. Still taking notes.
        </span>
        <a href={siteConfig.social.linkedin}>More notes on LinkedIn ↗</a>
      </div>
    </>
  );
}
