import Image from "next/image";
import { notebook } from "@/data/notebook";
import { TextLink } from "@/components/shared/text-link";

export function AboutIntro({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <section
        id="about"
        className="work-approach"
        aria-labelledby="approach-title"
      >
        <div className="approach-intro">
          <p className="eyebrow">What I bring.</p>
          <h2 id="approach-title">
            From the first screen to the production deploy.
          </h2>
          <p>
            I connect the interface, the backend, and the infrastructure —
            taking a feature through the whole stack.
          </p>
          <TextLink href="/about">A little more about me</TextLink>
        </div>
        <div className="approach-work">
          <p className="eyebrow">Work I’ve shipped</p>
          <dl>
            <div>
              <dt>Workflow automation</dt>
              <dd>
                Tools that connect services and turn repetitive tasks into
                workflows.
              </dd>
            </div>
            <div>
              <dt>Fintech applications</dt>
              <dd>
                Web and mobile products, backed by APIs and payment
                integrations.
              </dd>
            </div>
            <div>
              <dt>Cloud & delivery</dt>
              <dd>
                Infrastructure and deployment pipelines that take code into
                production.
              </dd>
            </div>
          </dl>
        </div>
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
