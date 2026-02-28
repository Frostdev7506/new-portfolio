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
  const lastUpdatedIso = "2026-02-28";
  const lastUpdatedText = "February 28, 2026";
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
      <p className="text-sm text-slate-400">
        Last updated: <time dateTime={lastUpdatedIso}>{lastUpdatedText}</time>
      </p>
      <p className="leading-relaxed text-slate-300">
        Editorial policy describing how technical articles are planned, reviewed, updated, and corrected on this engineering blog.
      </p>
      <p className="leading-relaxed text-slate-300">
        This publication is written for software engineers, founders, and hiring teams who want implementation-level guidance. Articles are educational and experience-based; they are not legal, financial, or medical advice.
      </p>

      <h2 className="text-2xl font-semibold text-slate-100">How articles are written</h2>
      <ul className="list-disc space-y-2 pl-6 leading-relaxed text-slate-300">
        <li>Posts start from real delivery work across full-stack and cloud projects.</li>
        <li>Each topic is scoped around a concrete problem, constraints, and trade-offs.</li>
        <li>Examples prioritize reproducible patterns over broad, theory-only guidance.</li>
        <li>Ambiguous claims are avoided; practical limits and assumptions are stated directly.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-slate-100">Review process</h2>
      <ul className="list-disc space-y-2 pl-6 leading-relaxed text-slate-300">
        <li>Drafts are checked for technical consistency, terminology, and operational accuracy.</li>
        <li>Code snippets are validated for syntax and realistic implementation context.</li>
        <li>Titles and descriptions are reviewed for clarity and search intent alignment.</li>
        <li>Major updates are published when framework behavior or platform defaults change.</li>
      </ul>
      <p className="leading-relaxed text-slate-300">
        Before publication, each article is reviewed for production relevance: deployment impact, failure modes, rollback strategy, and observability implications. This quality gate ensures recommendations are practical for real systems, not only for demo projects. When uncertainty exists, the post states boundaries and avoids absolute claims.
        The goal is to help readers execute with confidence, not copy vague checklists.
      </p>

      <h2 className="text-2xl font-semibold text-slate-100">Sources and trust model</h2>
      <p className="leading-relaxed text-slate-300">
        When external references are needed, preference is given to primary documentation and recognized standards. Typical source categories include runtime/framework docs, browser platform references, and security guidance.
      </p>
      <ul className="list-disc space-y-2 pl-6 leading-relaxed text-slate-300">
        <li>
          <a
            className="underline decoration-slate-500 underline-offset-2 hover:text-white"
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
            className="underline decoration-slate-500 underline-offset-2 hover:text-white"
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
            className="underline decoration-slate-500 underline-offset-2 hover:text-white"
            href="https://owasp.org/www-project-top-ten/"
            target="_blank"
            rel="noreferrer noopener"
          >
            OWASP Top 10
          </a>{" "}
          for security baseline considerations.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-slate-100">Corrections and updates</h2>
      <p className="leading-relaxed text-slate-300">
        Corrections are applied when errors are verified. Substantive revisions update this page date and the article publication metadata so readers can evaluate freshness.
      </p>

      <p className="leading-relaxed text-slate-300">
        If you find an issue or outdated section, contact me through the homepage form or email at{" "}
        <a className="underline decoration-slate-500 underline-offset-2 hover:text-white" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        . Verified fixes are published directly in source with transparent updates.
      </p>
    </section>
  );
}
