import Image from "next/image";
import Link from "next/link";
import { Newsreader } from "next/font/google";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ArticleUpdates } from "@/components/shared/article-updates";
import { Button } from "@/components/ui/button";
import { homeNotebook } from "@/data/notebook";
import { siteConfig } from "@/data/site";
import { LandingProjects, LandingToolkit } from "./landing-work";
import { LandingAbout, LandingContact, LandingExperience } from "./landing-story";

const editorial = Newsreader({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
  weight: ["400", "500"],
});

export function LandingPage() {
  return (
    <div className={`landing-page ${editorial.variable}`}>
      <a href="#landing-title" className="skip-link">Skip to content</a>
      <header className="lp-masthead landing-container">
        <Link href="/" className="lp-identity" aria-label={`${siteConfig.name} — home`}>
          <svg className="lp-monogram" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M7 10h11l17 21V12h-5v-2h13v2h-5v27h-3L15 15v21h5v2H7v-2h5V12H7z" />
          </svg>
        </Link>
        <nav className="lp-navigation" aria-label="Primary">
          <Link href="/blog">Blog</Link>
          <a href="#portfolio">Projects</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="lp-header-actions">
          <Link href="/resume" className="lp-resume">
            Résumé <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <ThemeToggle />
        </div>
      </header>

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
