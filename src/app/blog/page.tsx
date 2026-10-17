import { FeaturedArticles } from "@/components/blog/featured-articles";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageIntro } from "@/components/shared/page-intro";
import { ArticleUpdates } from "@/components/shared/article-updates";
import { getAllPosts, toPostSummary } from "@/lib/posts";
import { blogJsonLd, buildPageMetadata, fullUrl, serializeJsonLd } from "@/lib/seo";
import { notebook } from "@/data/notebook";
import { siteConfig } from "@/data/site";

const breadcrumbItems = [
  { name: "Home", href: "/" },
  { name: notebook.blogTitle, href: "/blog" },
];

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
  const selected = notebook.featuredSlugs.flatMap((slug) => {
    const post = posts.find((candidate) => candidate.slug === slug);
    return post ? [post] : [];
  });
  const featured = [
    ...selected,
    ...posts.filter((post) => !selected.some((item) => item.slug === post.slug)),
  ].slice(0, 5);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": fullUrl("/blog#breadcrumb"),
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: fullUrl(item.href),
    })),
  };
  const blog = blogJsonLd(posts, notebook.blogDescription);
  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": fullUrl("/blog#webpage"),
    url: fullUrl("/blog"),
    name: notebook.blogTitle,
    description: notebook.blogDescription,
    inLanguage: siteConfig.language,
    isPartOf: { "@id": fullUrl("/#website") },
    breadcrumb: { "@id": breadcrumb["@id"] },
    mainEntity: { "@id": blog["@id"] },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([blog, breadcrumb, collectionPage]),
        }}
      />
      <Breadcrumbs items={breadcrumbItems} includeJsonLd={false} />
      <PageIntro
        className="blog-intro"
        title={notebook.blogTitle}
        description={notebook.blogIntro}
      />
      <FeaturedArticles posts={featured} />
      <BlogExplorer posts={posts} />
      <ArticleUpdates />
    </>
  );
}
