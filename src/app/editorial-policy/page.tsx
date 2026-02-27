import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Editorial Policy",
  description:
    "Editorial policy describing how technical articles are planned, reviewed, updated, and corrected on this engineering blog.",
  path: "/editorial-policy",
  keywords: ["editorial policy", "engineering content standards", "technical writing process"],
});

export default function EditorialPolicyPage() {
  const pageUrl = `${siteConfig.url}/editorial-policy`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Editorial Policy", item: pageUrl },
    ],
  };

  const editorialJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Editorial Policy",
    description:
      "Editorial policy describing how technical articles are planned, reviewed, updated, and corrected on this engineering blog.",
    url: pageUrl,
    inLanguage: siteConfig.language,
  };

  return (
    <section className="space-y-6 rounded-3xl border border-border bg-slate-950/80 p-6 text-slate-200 shadow-sm md:p-8">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(editorialJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <h1 className="text-3xl font-semibold text-slate-100">Editorial Policy</h1>
      <p className="leading-relaxed text-slate-300">
        This policy explains how technical articles are created on this site. The goal is to publish practical engineering content that is accurate, readable, and useful for implementation.
      </p>

      <h2 className="text-2xl font-semibold text-slate-100">How content is written</h2>
      <ul className="list-disc space-y-2 pl-6 leading-relaxed text-slate-300">
        <li>Posts are based on applied work from full-stack and cloud projects.</li>
        <li>Examples focus on decisions, trade-offs, and production outcomes.</li>
        <li>Claims are kept specific and updated when better approaches appear.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-slate-100">Review and updates</h2>
      <p className="leading-relaxed text-slate-300">
        Articles are reviewed for technical consistency before publication. Older posts are revised when frameworks, platform behavior, or recommended delivery practices change materially.
      </p>

      <h2 className="text-2xl font-semibold text-slate-100">Corrections</h2>
      <p className="leading-relaxed text-slate-300">
        If you notice an error or outdated section, please report it using the contact channel on the homepage. Verified corrections are applied directly in the source content.
      </p>
    </section>
  );
}
