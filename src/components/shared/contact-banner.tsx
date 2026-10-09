import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site";

export function ContactBanner({ compact = false }: { compact?: boolean }) {
  return (
    <section id="contact" className="contact-banner">
      <Image
        src={
          compact
            ? "/illustrations/paper-plane.png"
            : "/illustrations/envelope.png"
        }
        alt=""
        width={250}
        height={170}
      />
      <div>
        <h2>
          {compact
            ? "Let’s build something useful."
            : "Have something in mind?"}
        </h2>
        {!compact && <p>I’d love to hear about it.</p>}
        <div className="banner-actions">
          <Button asChild size="lg" className="primary-button">
            <Link href="/contact">
              {compact ? "Get in touch" : "Say hello"}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          {!compact && (
            <a className="banner-email" href={"mailto:" + siteConfig.email}>
              {siteConfig.email}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
