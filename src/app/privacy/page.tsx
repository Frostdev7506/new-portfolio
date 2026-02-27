import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Privacy policy for this portfolio covering contact form data, storage scope, third-party services, and deletion requests.",
  path: "/privacy",
  keywords: ["privacy policy", "data handling", "portfolio site privacy"],
});

export default function PrivacyPage() {
  const pageUrl = `${siteConfig.url}/privacy`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: pageUrl },
    ],
  };

  const privacyJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    description:
      "Privacy policy for this portfolio covering contact form data, storage scope, third-party services, and deletion requests.",
    url: pageUrl,
    inLanguage: siteConfig.language,
  };

  return (
    <section className="space-y-6 rounded-3xl border border-border bg-slate-950/80 p-6 text-slate-200 shadow-sm md:p-8">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <h1 className="text-3xl font-semibold text-slate-100">Privacy Policy</h1>
      <p className="leading-relaxed text-slate-300">
        This page explains what information is collected on this portfolio and how it is used. The site is designed to collect minimal personal data and use it only for direct communication.
      </p>

      <h2 className="text-2xl font-semibold text-slate-100">What data is collected</h2>
      <ul className="list-disc space-y-2 pl-6 leading-relaxed text-slate-300">
        <li>Name, email address, and message you submit through the contact form.</li>
        <li>Basic hosting and request logs used for security and reliability monitoring.</li>
        <li>No advertising profile data and no sale of personal information.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-slate-100">How data is used</h2>
      <p className="leading-relaxed text-slate-300">
        Submitted details are used only to respond to your inquiry, evaluate collaboration requests, and maintain communication related to your message. Data is not reused for unrelated campaigns.
      </p>

      <h2 className="text-2xl font-semibold text-slate-100">Retention and removal</h2>
      <p className="leading-relaxed text-slate-300">
        If you want your submitted information removed, send a request to <a className="underline" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. Reasonable deletion requests are honored as soon as possible.
      </p>
    </section>
  );
}
