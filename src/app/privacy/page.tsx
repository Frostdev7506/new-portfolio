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
  const lastUpdatedIso = "2026-02-28";
  const lastUpdatedText = "February 28, 2026";
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
      <p className="text-sm text-slate-400">
        Last updated: <time dateTime={lastUpdatedIso}>{lastUpdatedText}</time>
      </p>
      <p className="leading-relaxed text-slate-300">
        Privacy policy for this portfolio covering contact form data, storage scope, third-party services, and deletion requests.
      </p>
      <p className="leading-relaxed text-slate-300">
        This website is designed to minimize personal details collection. Messages shared through the contact form are processed only for legitimate inquiries, project discussions, and direct follow-up requested by the sender.
      </p>

      <h2 className="text-2xl font-semibold text-slate-100">What details are collected</h2>
      <ul className="list-disc space-y-2 pl-6 leading-relaxed text-slate-300">
        <li>Contact details you submit directly, such as name, email address, and message body.</li>
        <li>Basic hosting diagnostics (for example IP, user-agent, and timestamps) for reliability and abuse prevention.</li>
        <li>Optional technical metadata required by third-party delivery services that power this site.</li>
        <li>No behavioral advertising profiles and no sale of personal details.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-slate-100">How requests are handled and retained</h2>
      <p className="leading-relaxed text-slate-300">
        Submitted messages are reviewed to respond to inquiries, evaluate collaboration requests, and maintain direct communication related to the original request. Records are retained only as long as operationally necessary for communication, security, and audit needs.
      </p>
      <p className="leading-relaxed text-slate-300">
        If a request is resolved and no further communication is needed, related records are periodically removed from active workflows. Retained logs are limited to service reliability, fraud prevention, and legal compliance where required.
      </p>

      <h2 className="text-2xl font-semibold text-slate-100">Third-party services</h2>
      <p className="leading-relaxed text-slate-300">
        This site may use managed providers for hosting, analytics, and contact-form delivery. These providers process limited technical data as part of delivering the service. Their handling practices are governed by their own policies, including:
      </p>
      <ul className="list-disc space-y-2 pl-6 leading-relaxed text-slate-300">
        <li>
          <a
            className="underline decoration-slate-500 underline-offset-2 hover:text-white"
            href="https://www.netlify.com/privacy/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Netlify Privacy Policy
          </a>
        </li>
        <li>
          <a
            className="underline decoration-slate-500 underline-offset-2 hover:text-white"
            href="https://www.emailjs.com/legal/privacy-policy/"
            target="_blank"
            rel="noreferrer noopener"
          >
            EmailJS Privacy Policy
          </a>
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-slate-100">Your rights and deletion requests</h2>
      <p className="leading-relaxed text-slate-300">
        You can request review, correction, or deletion of submitted personal information by emailing{" "}
        <a className="underline decoration-slate-500 underline-offset-2 hover:text-white" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        . Reasonable verified inquiries are processed as soon as practical.
      </p>
      <p className="leading-relaxed text-slate-300">
        Requests may require identity confirmation before account-related actions are completed. This step helps prevent unauthorized disclosure and protects both sender privacy and platform integrity.
      </p>
      <p className="leading-relaxed text-slate-300">
        This policy is reviewed periodically to reflect operational or legal changes. When significant updates are made, the last-updated date on this page is revised.
      </p>
    </section>
  );
}
