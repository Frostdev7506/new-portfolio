import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { getAllPosts } from "@/lib/posts";
import { buildPageMetadata, fullUrl } from "@/lib/seo";
import { BlogClientContent } from "@/components/blog/blog-client-content";

export const metadata: Metadata = buildPageMetadata({
  title: "Engineering Blog and Technical Notes",
  description:
    "Practical engineering notes on architecture, rendering, APIs, delivery quality, and reliability patterns from production software projects.",
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
      "Practical engineering notes on architecture, rendering, APIs, delivery quality, and reliability patterns from production software projects.",
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

      {/* Ambient floating background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="grid gap-16 lg:grid-cols-12 lg:gap-8 relative z-10 w-full mb-32">
        <div className="lg:col-span-8 flex flex-col items-start justify-center">
          <div className="mb-8 border border-primary/20 bg-primary/5 px-4 py-1.5 text-[0.65rem] tracking-[0.3em] uppercase text-muted-foreground w-fit">
            Practical Notes
          </div>

          <h1 className="text-6xl font-black tracking-tighter sm:text-7xl lg:text-8xl w-full max-w-[12ch] leading-[0.9] mb-8 uppercase">
            <span className="block text-primary">Engineering</span>
            <span className="block text-muted-foreground/30 font-light mt-2 tracking-tight">Blog</span>
          </h1>

          <p className="max-w-xl text-base text-muted-foreground leading-relaxed font-light tracking-wide">
            Practical notes from real product work: architecture choices, API design, delivery quality, and reliability patterns from production software projects.
          </p>
        </div>

        <div className="lg:col-span-4 relative hidden lg:flex items-end justify-end pb-8">
          <div className="absolute top-1/2 right-0 -mr-8 origin-bottom-right -rotate-90 text-[10px] tracking-[0.5em] text-muted-foreground/30 whitespace-nowrap uppercase">
            04 // Writing
          </div>
        </div>
      </div>

      <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4 space-y-12">
          <div>
            <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground mb-6 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-primary/40 block"></span>
              The Approach
            </h2>
            <div className="space-y-6 text-sm text-muted-foreground font-light leading-relaxed">
              <p>
                These posts document implementation choices evaluated under real constraints. The focus is on practical trade-offs, not theoretical generic tutorials.
              </p>
              <p>
                Topics include hybrid rendering strategies, API predictability at scale, rollout observability, and technical maintainability patterns.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <BlogClientContent posts={posts} />
        </div>
      </div>
    </section>
  );
}
