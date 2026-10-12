import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site";

export function ContactPostcard() {
  return (
    <section
      id="contact"
      className="contact-postcard"
      aria-labelledby="postcard-title"
    >
      <Image
        src="/illustrations/postcard-paper.png"
        alt=""
        fill
        sizes="(max-width: 900px) 100vw, 1040px"
        className="postcard-paper"
      />
      <div className="postcard-message">
        <h2 id="postcard-title">A note<br />from you?</h2>
        <p>A project, a question, or something you read here — my inbox is open.</p>
        <p className="postcard-signature">— Neeraj</p>
      </div>
      <div className="postcard-recipient">
        <Image
          src="/illustrations/postcard-stamp.png"
          alt=""
          width={1493}
          height={1054}
          sizes="(max-width: 600px) 180px, 240px"
          className="postcard-stamp"
        />
        <address>
          <span className="postcard-to">To:</span>
          <span className="postcard-name">Neeraj Butola</span>
          <a href={"mailto:" + siteConfig.email}>{siteConfig.email}</a>
        </address>
        <Button asChild size="lg" className="primary-button">
          <a href={"mailto:" + siteConfig.email}>
            Write to me <ArrowUpRight aria-hidden="true" />
          </a>
        </Button>
      </div>
    </section>
  );
}
