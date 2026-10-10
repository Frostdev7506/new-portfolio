import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactBanner() {
  return (
    <section id="contact" className="contact-banner">
      <Image
        src="/illustrations/paper-plane.png"
        alt=""
        width={360}
        height={250}
        sizes="(max-width: 900px) 145px, 250px"
      />
      <div>
        <h2>Let’s build something useful.</h2>
        <div className="banner-actions">
          <Button asChild size="lg" className="primary-button">
            <Link href="/contact">
              Get in touch
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
