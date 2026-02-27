import type { Metadata } from "next";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { siteConfig } from "@/data/site";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering notes on web rendering, full-stack development, and software delivery.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <header className="rounded-3xl border border-border bg-white px-6 py-10 text-center shadow-sm dark:bg-slate-900">
        <p className="text-xs uppercase tracking-[0.22em] text-brand-700 dark:text-brand-300">Writing</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">
          My Blogs
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-base text-slate-600 dark:text-slate-300">
          Articles on software engineering, rendering strategy, and practical product development.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
