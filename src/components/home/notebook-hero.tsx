import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/shared/text-link";
import { homeNotebook } from "@/data/notebook";

export function NotebookHero() {
  return (
    <section className="portfolio-hero" aria-labelledby="notebook-title">
      <p className="eyebrow">{homeNotebook.eyebrow}</p>
      <h1 id="notebook-title">
        {homeNotebook.title.map((line) => <span key={line}>{line}</span>)}
      </h1>
      <p className="portfolio-hero-description">{homeNotebook.description}</p>
      <div className="portfolio-hero-actions">
        <Button asChild size="lg" className="primary-button">
          <a href="#portfolio">
            {homeNotebook.projectsLink} <ArrowRight aria-hidden="true" />
          </a>
        </Button>
        <TextLink href="/blog">{homeNotebook.blogLink}</TextLink>
      </div>
    </section>
  );
}
