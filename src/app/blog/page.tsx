import type { Metadata } from "next";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { siteConfig } from "@/data/site";
import { getAllPosts } from "@/lib/posts";
import { buildPageMetadata, fullUrl } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Engineering Blog and Technical Notes",
  description:
    "Actionable engineering notes on web rendering, full-stack architecture, cloud delivery, and practical decisions used in real production projects.",
  path: "/blog",
  keywords: [
    "software engineering blog",
    "Next.js blog",
    "web performance articles",
    "cloud engineering notes",
  ],
});

export default async function BlogPage() {
  const posts = await getAllPosts();
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteConfig.name} Blog`,
    description:
      "Engineering notes on web rendering, full-stack development, and software delivery.",
    url: `${siteConfig.url}/blog`,
    inLanguage: siteConfig.language,
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    dateModified: new Date().toISOString(),
    image: fullUrl(siteConfig.image),
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
    ],
  };

  return (
    <section className="space-y-8">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <header className="rounded-3xl border border-border bg-white px-6 py-10 text-center shadow-sm dark:bg-slate-900">
        <p className="text-xs uppercase tracking-[0.22em] text-brand-700 dark:text-brand-300">Writing</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">
          Engineering Blog
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-base text-slate-600 dark:text-slate-300">
          Practical notes from real product work: architecture choices, performance trade-offs, and shipping patterns.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-white p-6 text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">What you will find here</h2>
        <p className="mt-3 leading-relaxed">
          These articles document implementation decisions I use in day-to-day full-stack work. Instead of generic tutorials, each post focuses on what works in production: where bottlenecks appear, how trade-offs are evaluated, and which patterns improve reliability over time.
        </p>
        <p className="mt-3 leading-relaxed">
          Topics include rendering strategy, API design, performance optimization, and delivery workflows. Every article is written from practical engineering experience and updated as the codebase evolves.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
