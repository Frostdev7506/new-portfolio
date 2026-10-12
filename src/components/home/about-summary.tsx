import { homeNotebook } from "@/data/notebook";
import { TextLink } from "@/components/shared/text-link";

export function AboutSummary() {
  return (
    <section id="about" className="home-profile" aria-labelledby="about-title">
      <div className="home-profile-heading">
        <p className="eyebrow">{homeNotebook.aboutLabel}</p>
        <h2 id="about-title">
          {homeNotebook.aboutTitle.map((line) => <span key={line}>{line}</span>)}
        </h2>
      </div>
      <div className="home-profile-copy">
        {homeNotebook.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <TextLink href="/about">{homeNotebook.aboutLink}</TextLink>
      </div>
    </section>
  );
}
