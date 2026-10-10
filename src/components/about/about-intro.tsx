import Image from "next/image";
import { homeNotebook, notebook } from "@/data/notebook";
import { TextLink } from "@/components/shared/text-link";

export function AboutIntro({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <section id="about" className="home-about" aria-labelledby="about-title">
        <div>
          <p className="eyebrow">About</p>
          <h2 id="about-title">A little context.</h2>
          {homeNotebook.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <TextLink href="/about">More about me</TextLink>
        </div>
        <Image
          src="/illustrations/about-connections.png"
          alt="The parts in between: a web app connects to APIs and cloud infrastructure."
          width={1470}
          height={1070}
          sizes="(max-width: 600px) 85vw, 380px"
          className="about-connections"
        />
      </section>
    );
  }

  return (
    <section id="about" className="about-intro">
      <div>
        <h2>Building across the stack.</h2>
        {notebook.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <TextLink href="/resume">View résumé</TextLink>
      </div>
      <Image
        src="/illustrations/notebook.png"
        alt="An open notebook connects web apps, APIs, and cloud systems: ideas, build, learn."
        width={1448}
        height={1086}
        sizes="(max-width: 900px) 100vw, 500px"
        className="notebook-art"
      />
    </section>
  );
}
