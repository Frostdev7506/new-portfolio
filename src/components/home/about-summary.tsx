import Image from "next/image";
import { homeNotebook } from "@/data/notebook";
import { TextLink } from "@/components/shared/text-link";

export function AboutSummary() {
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
