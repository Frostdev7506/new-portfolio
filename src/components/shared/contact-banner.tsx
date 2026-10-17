import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactBanner() {
  return (
    <section id="contact" className="contact-banner" aria-labelledby="contact-banner-title">
      <h2 id="contact-banner-title">Let’s build something useful.</h2>
      <Button asChild size="lg" className="primary-button">
        <Link href="/contact">
          Get in touch
          <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    </section>
  );
}
