import Image from "next/image";
import { ArrowUpRight, Github, Linkedin, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { CopyEmail } from "@/components/contact/copy-email";
import { PageIntro } from "@/components/shared/page-intro";
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
        title="Contact"
        description={notebook.contactDescription}
      />
      <div className="contact-grid">
        <section aria-label="Contact form">
          <ContactForm />
        </section>
        <aside className="contact-details">
          <Image
            src="/illustrations/contact-letter.png"
            width={1536}
            height={1024}
            alt=""
            className="contact-art"
            sizes="(max-width: 760px) 280px, (max-width: 1200px) 320px, 400px"
            priority
          />
          <h2 className="contact-detail-title">Prefer email?</h2>
          <CopyEmail />
          <div className="contact-elsewhere">
            <h2 className="contact-detail-title">Elsewhere</h2>
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={20} strokeWidth={1.75} aria-hidden="true" />
              <span>GitHub</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={20} strokeWidth={1.75} aria-hidden="true" />
              <span>LinkedIn</span>
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
