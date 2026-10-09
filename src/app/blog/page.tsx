import Image from "next/image";
import { FeaturedArticle } from "@/components/blog/featured-article";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { PageIntro } from "@/components/shared/page-intro";
import { TextLink } from "@/components/shared/text-link";
import { getAllPosts } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";
import { notebook } from "@/data/notebook";
import { siteConfig } from "@/data/site";

export const metadata = buildPageMetadata({
  title: "Blog",
  description: notebook.blogDescription,
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getAllPosts();
  const featured = posts.find((post) => post.slug === notebook.featuredSlug);
  const breadcrumbJsonLd = {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PageIntro
        className="blog-intro"
        eyebrow="Open notebook."
        title="Blog"
        description={notebook.blogDescription}
        image="/illustrations/blog-notebooks.png"
      />
      {featured && <FeaturedArticle post={featured} />}
      <section className="blog-archive section-block">
        <h2 className="eyebrow">From the archive.</h2>
        {posts
          .filter((post) => post.slug !== featured?.slug)
          .map((post) => (
            <BlogPostCard post={post} key={post.slug} />
          ))}
      </section>
      <section className="explore-banner">
        <Image
          src="/illustrations/build-learn.png"
          alt=""
          width={170}
          height={130}
        />
        <div>
          <h2>Looking for what I’ve built?</h2>
          <TextLink href="/projects">Explore projects</TextLink>
        </div>
      </section>
    </>
  );
}
