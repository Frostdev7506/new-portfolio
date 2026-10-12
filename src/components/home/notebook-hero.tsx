import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/shared/text-link";
import { homeNotebook } from "@/data/notebook";

export function NotebookHero() {
  return (
    <section className="notebook-hero" aria-labelledby="notebook-title">
      <div className="notebook-hero-copy">
        <p className="eyebrow">{homeNotebook.eyebrow}</p>
        <h1 id="notebook-title">
          {homeNotebook.title.map((line) => <span key={line}>{line}</span>)}
        </h1>
        <p className="hero-description">{homeNotebook.description}</p>
        <div className="hero-actions">
          <Button asChild size="lg" className="primary-button">
            <a href="#portfolio">
              Explore projects <ArrowRight aria-hidden="true" />
            </a>
          </Button>
          <TextLink href="/blog" className="quiet-link">{homeNotebook.blogLink}</TextLink>
        </div>
      </div>
      <Image
        src="/illustrations/home-workbench.png"
        alt="A browser, a server, and an open notebook connected by a teal cable."
        width={1254}
        height={1254}
        sizes="(max-width: 600px) 85vw, (max-width: 900px) 40vw, 440px"
        className="hero-workbench"
        priority
      />
    </section>
  );
}
