import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactNote } from "@/data/notebook";
import { siteConfig } from "@/data/site";

export function ContactPostcard() {
  return (
    <section
      id="contact"
      className="home-contact"
      aria-labelledby="home-contact-title"
    >
      <div className="home-contact-copy">
        <h2 id="home-contact-title">{contactNote.title}</h2>
        <p>{contactNote.description}</p>
      </div>
      <div className="home-contact-action">
        <address>{siteConfig.email}</address>
        <Button asChild size="lg" className="primary-button home-contact-cta">
          <a href={"mailto:" + siteConfig.email}>
            {contactNote.action} <ArrowUpRight aria-hidden="true" />
          </a>
        </Button>
      </div>
    </section>
  );
}
