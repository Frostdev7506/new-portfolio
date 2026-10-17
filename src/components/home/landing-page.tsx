import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleUpdates } from "@/components/shared/article-updates";
import { Button } from "@/components/ui/button";
import { homeNotebook } from "@/data/notebook";
import { LandingProjects, LandingToolkit } from "./landing-work";
import { LandingAbout, LandingContact, LandingExperience } from "./landing-story";

export function LandingPage() {
  return (
    <div className="landing-page">
      <section className="lp-hero landing-container" aria-labelledby="landing-title">
        <div className="lp-hero-copy">
          <p className="lp-intro">{homeNotebook.eyebrow}</p>
          <h1 id="landing-title" tabIndex={-1}>
            {homeNotebook.title.map((line) => <span key={line}>{line}</span>)}
          </h1>
          <p className="lp-description">{homeNotebook.description}</p>
          <Button asChild size="lg" className="lp-blog-action">
            <Link href="/blog">
              {homeNotebook.actions.blog} <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="lp-hero-art">
          <Image
            src="/illustrations/home-workbench.png"
            alt="A browser, a server, and an open notebook connected by a teal cable."
            width={1254}
            height={1254}
            sizes="(max-width: 700px) 90vw, (max-width: 1100px) 42vw, 520px"
            priority
          />
        </div>
      </section>

      <LandingProjects />
      <LandingToolkit />
      <LandingExperience />
      <LandingContact />
      <LandingAbout />
      <div className="landing-container">
        <ArticleUpdates />
      </div>
    </div>
  );
}
