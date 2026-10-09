import Image from "next/image";
import { notebook } from "@/data/notebook";
import { TextLink } from "@/components/shared/text-link";

export function AboutIntro({ compact = false }: { compact?: boolean }) {
  return (
    <section
      id="about"
      className={"about-intro" + (compact ? " compact-about" : "")}
    >
      <div>
        {compact && <p className="eyebrow">Behind the notebook.</p>}
        <h2>Building across the stack.</h2>
        {(compact
          ? [notebook.about[0], notebook.about[2]]
          : notebook.about
        ).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {!compact && <TextLink href="/resume">View résumé</TextLink>}
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
