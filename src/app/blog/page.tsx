import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { getAllPosts } from "@/lib/posts";
import { buildPageMetadata, fullUrl } from "@/lib/seo";
import { BlogClientContent } from "@/components/blog/blog-client-content";

export const metadata: Metadata = buildPageMetadata({
  title: "Engineering Blog and Technical Notes",
  description:
    "Practical notes on architecture, rendering, APIs, and release quality from real software projects.",
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
      "Practical notes on architecture, rendering, APIs, and release quality from real software projects.",
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
    <section className="relative overflow-hidden py-24 lg:py-32 border-b border-border/40">
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

      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 relative z-10 w-full">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-6">
            Engineering Blog
          </h1>
          <p className="text-muted-foreground/80 max-w-lg font-light tracking-wide text-lg sm:text-xl">
            Practical notes from real product work: architecture choices, performance trade-offs, and shipping patterns.
          </p>
        </div>
        <div className="hidden md:block text-xs uppercase tracking-[0.3em] font-medium text-muted-foreground/40 text-right">
          04 // Writing
        </div>
      </div>

      <div className="space-y-12">
        <section className="bg-muted/30 border border-border/50 rounded-2xl p-8 shadow-sm backdrop-blur-sm relative overflow-hidden group">
          {/* Subtle reveal gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />

          <h2 className="text-2xl font-bold tracking-tight uppercase text-foreground mb-4">What you will find here</h2>
          <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
            <p>
              These posts document the implementation choices used in day-to-day product engineering. The focus is on practical trade-offs, not generic tutorials. You will see how architecture, performance, and delivery decisions are evaluated under real constraints.
            </p>
            <p>
              Topics include rendering strategy, API design, deployment workflows, and maintainability patterns. Every article is based on applied project experience and updated when a better approach proves itself.
            </p>
          </div>

          <h3 className="text-lg font-semibold tracking-tight uppercase text-foreground mt-8 mb-4">Article themes</h3>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground font-light leading-relaxed">
            <li>Choosing between SSR, CSR, SSG, and hybrid rendering with clear decision criteria.</li>
            <li>Designing APIs and background jobs for predictable behavior at production scale.</li>
            <li>Improving release quality with small deploy slices, observability, and rollback discipline.</li>
            <li>Balancing product velocity with long-term maintainability and technical clarity.</li>
          </ul>
        </section>

        <BlogClientContent posts={posts} />
      </div>
    </section>
  );
}
