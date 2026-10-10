import Image from "next/image";
import { ArrowUpRight, Github, Linkedin, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { CopyEmail } from "@/components/contact/copy-email";
import { PageIntro } from "@/components/shared/page-intro";
import { TextLink } from "@/components/shared/text-link";
import { notebook } from "@/data/notebook";
import { siteConfig } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact",
  description: notebook.contactDescription,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageIntro
        className="contact-intro"
        eyebrow="Say hello."
        title="Contact"
      />
      <header className="contact-lead">
        <h2>Have something in mind?</h2>
        <p className="contact-description">{notebook.contactDescription}</p>
      </header>
      <div className="contact-grid">
        <section aria-label="Contact form">
          <ContactForm />
        </section>
        <aside className="contact-details">
          <Image
            src="/illustrations/contact-letter.png"
            width={1536}
            height={1024}
            alt="An open envelope with a notebook letter, connected to a browser by a teal cable."
            className="contact-art"
            sizes="(max-width: 900px) 310px, 440px"
            priority
          />
          <p className="eyebrow">Prefer email?</p>
          <CopyEmail />
          <TextLink href={"mailto:" + siteConfig.email}>Email me</TextLink>
          <div className="contact-elsewhere">
            <h2 className="eyebrow">Elsewhere</h2>
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github aria-hidden="true" />
              <span>GitHub</span>
              <span>{siteConfig.githubUsername}</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin aria-hidden="true" />
              <span>LinkedIn</span>
              <span>{siteConfig.name}</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <p className="contact-location">
            <MapPin size={23} strokeWidth={1.5} aria-hidden="true" />
            Based in {siteConfig.location}
          </p>
        </aside>
      </div>
    </>
  );
}
