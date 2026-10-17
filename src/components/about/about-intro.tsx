import Image from "next/image";
import { notebook } from "@/data/notebook";
import { TextLink } from "@/components/shared/text-link";

export function AboutIntro() {
  return (
    <section id="about" className="about-intro" aria-labelledby="about-intro-title">
      <div>
        <h2 id="about-intro-title">Building across the stack.</h2>
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
        sizes="(max-width: 700px) 90vw, 440px"
        className="notebook-art"
        priority
      />
    </section>
  );
}
