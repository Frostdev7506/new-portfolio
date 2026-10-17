import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { siteConfig } from "@/data/site";
import { buildPageMetadata, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "I do not collect or store personal data from browsing this website. Learn about optional contact messages and newsletter subscriptions, browser preferences, and hosting services.",
  path: "/privacy",
  keywords: ["privacy policy", "data handling", "portfolio site privacy"],
});

export default function PrivacyPage() {
  const pageUrl = `${siteConfig.url}/privacy`;
  const lastUpdatedIso = "2026-10-16";
  const lastUpdatedText = "October 16, 2026";
  const privacyJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    description:
      "I do not collect or store personal data from browsing this website. Learn about optional contact messages and newsletter subscriptions, browser preferences, and hosting services.",
    url: pageUrl,
    inLanguage: siteConfig.language,
  };

  return (
    <section className="document-page policy-page">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Privacy Policy", href: "/privacy" },
        ]}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(privacyJsonLd) }}
      />
      <h1>Privacy Policy</h1>
      <p className="document-updated">
        Last updated: <time dateTime={lastUpdatedIso}>{lastUpdatedText}</time>
      </p>
      <p>
        I do not collect or store personal data about you when you browse this
        website. I do not sell your data or use it to build advertising profiles.
      </p>
      <p>
        This website has no user accounts or personal-data database. Your light
        or dark theme preference is saved locally in your browser and is not
        sent to me.
      </p>

      <h2>If you choose to contact me</h2>
      <p>
        If you send an email or submit the contact form, you voluntarily share
        your name, email address, and message. I use these details only to respond
        to your inquiry and any follow-up you request.
      </p>
      <p>
        The form uses EmailJS when configured, or prepares a draft for you to
        send from your own email app. Sent messages may be retained by the email
        services and in my inbox; they are not saved in a website database.
      </p>

      {siteConfig.newsletterUrl && (
        <>
          <h2>Newsletter subscriptions</h2>
          <p>
            Newsletter signups are handled on Kit’s website. Kit stores the
            details you provide there and manages confirmation, email delivery,
            and unsubscribe requests for this newsletter. You can stop
            receiving the newsletter using the unsubscribe link in any issue.
            This website does not maintain a separate subscriber database.
          </p>
        </>
      )}

      <h2>Third-party services</h2>
      <p>
        Hosting and email providers may process technical information, such as
        IP addresses, browser details, and timestamps, to deliver and secure
        their services. Their handling of that information is governed by their
        own privacy policies:
      </p>
      <ul>
        <li>
          <a
            href="https://www.netlify.com/privacy/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Netlify Privacy Policy
          </a>
        </li>
        <li>
          <a
            href="https://www.emailjs.com/legal/privacy-policy/"
            target="_blank"
            rel="noreferrer noopener"
          >
            EmailJS Privacy Policy
          </a>
        </li>
      </ul>

      <h2>Questions or deletion requests</h2>
      <p>
        You can request review, correction, or deletion of submitted personal
        information by emailing{" "}
        <a href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        .
      </p>
    </section>
  );
}
