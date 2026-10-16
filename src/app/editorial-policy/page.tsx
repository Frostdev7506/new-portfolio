import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Editorial Policy",
  description:
    "Editorial policy describing how technical articles are planned, reviewed, updated, and corrected on this engineering blog.",
  path: "/editorial-policy",
  keywords: [
    "editorial policy",
    "engineering content standards",
    "technical writing process",
  ],
});

export default function EditorialPolicyPage() {
  const pageUrl = `${siteConfig.url}/editorial-policy`;
  const lastUpdatedIso = "2026-10-10";
  const lastUpdatedText = "October 10, 2026";
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Editorial Policy",
        item: pageUrl,
      },
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
    <section className="document-page policy-page">
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
      <h1>Editorial Policy</h1>
      <p className="document-updated">
        Last updated: <time dateTime={lastUpdatedIso}>{lastUpdatedText}</time>
      </p>
      <p>
        Editorial policy describing how technical articles are planned,
        reviewed, updated, and corrected on this engineering blog.
      </p>
      <p>
        This publication is written for software engineers, founders, and hiring
        teams who want implementation-level guidance. Articles combine
        educational explanations, personal notes, and clearly labeled worked
        examples; they are not legal, financial, or medical advice.
      </p>

      <h2>How articles are written</h2>
      <ul>
        <li>
          Posts start from engineering questions, personal notes, and LinkedIn
          discussions. Expanded posts link to their original source.
        </li>
        <li>
          Each topic is scoped around a concrete problem, constraints, and
          trade-offs.
        </li>
        <li>
          Examples prioritize reproducible patterns over broad, theory-only
          guidance.
        </li>
        <li>
          Ambiguous claims are avoided; practical limits and assumptions are
          stated directly.
        </li>
      </ul>

      <h2>Review process</h2>
      <ul>
        <li>
          Drafts are checked for technical consistency, terminology, and
          operational accuracy.
        </li>
        <li>
          Code snippets are validated for syntax and realistic implementation
          context.
        </li>
        <li>
          Titles and descriptions are reviewed for clarity and search intent
          alignment.
        </li>
        <li>
          Major updates are published when framework behavior or platform
          defaults change.
        </li>
      </ul>
      <p>
        Before publication, each article is reviewed for production relevance:
        deployment impact, failure modes, rollback strategy, and observability
        implications. This quality gate ensures recommendations are practical
        for real systems, not only for demo projects. When uncertainty exists,
        the post states boundaries and avoids absolute claims. The goal is to
        help readers execute with confidence, not copy vague checklists.
      </p>

      <h2>Sources and trust model</h2>
      <p>
        When external references are needed, preference is given to primary
        documentation and recognized standards. Typical source categories
        include runtime/framework docs, browser platform references, and
        security guidance.
      </p>
      <ul>
        <li>
          <a
            href="https://developer.mozilla.org/"
            target="_blank"
            rel="noreferrer noopener"
          >
            MDN Web Docs
          </a>{" "}
          for browser and web platform behavior.
        </li>
        <li>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noreferrer noopener"
          >
            Next.js Documentation
          </a>{" "}
          for framework-specific capabilities and constraints.
        </li>
        <li>
          <a
            href="https://owasp.org/www-project-top-ten/"
            target="_blank"
            rel="noreferrer noopener"
          >
            OWASP Top 10
          </a>{" "}
          for security baseline considerations.
        </li>
      </ul>

      <h2>Corrections and updates</h2>
      <p>
        Corrections are applied when errors are verified. Substantive revisions
        update the article’s modification date while preserving its original
        publication date, so readers can evaluate freshness.
      </p>

      <p>
        If you find an issue or outdated section, contact me through the contact
        page or email at{" "}
        <a href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        . Verified fixes are published directly in source with transparent
        updates.
      </p>
    </section>
  );
}
