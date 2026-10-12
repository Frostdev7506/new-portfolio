import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/shared/text-link";
import { homeNotebook } from "@/data/notebook";
import { siteConfig } from "@/data/site";

export function ContactPostcard() {
  return (
    <section
      id="contact"
      className="contact-invitation"
      aria-labelledby="contact-invitation-title"
    >
      <p className="eyebrow">{homeNotebook.contact.label}</p>
      <h2 id="contact-invitation-title">{homeNotebook.contact.title}</h2>
      <p className="contact-invitation-description">{homeNotebook.contact.description}</p>
      <div className="contact-invitation-actions">
        <Button asChild size="lg" className="primary-button">
          <a href={"mailto:" + siteConfig.email}>
            {homeNotebook.contact.emailLink} <ArrowUpRight aria-hidden="true" />
          </a>
        </Button>
        <TextLink href="/contact">{homeNotebook.contact.detailsLink}</TextLink>
      </div>
    </section>
  );
}
