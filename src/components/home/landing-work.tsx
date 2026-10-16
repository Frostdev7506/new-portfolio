import Image from "next/image";
import { ProjectIndex } from "@/components/projects/project-index";
import { projects } from "@/data/projects";
import {
  cloudPlatforms,
  mernStack,
  supportingTechnologies,
  technologyStackCopy,
  type Technology,
} from "@/data/technology-stack";

export function LandingProjects() {
  return (
    <div className="lp-work landing-container">
      <ProjectIndex projects={projects.slice(0, 3)} />
    </div>
  );
}

function TechnologyRow({
  title,
  technologies,
  primary = false,
}: {
  title: string;
  technologies: readonly Technology[];
  primary?: boolean;
}) {
  return (
    <div className={primary ? "lp-technology-row lp-technology-primary" : "lp-technology-row"}>
      <h3>{title}</h3>
      <ul>
        {technologies.map((technology) => (
          <li key={technology.name}>
            <span className="lp-technology-logo">
              <Image
                src={`/technology-logos/${technology.logo}.svg`}
                width={primary ? 32 : 24}
                height={primary ? 32 : 24}
                loading="lazy"
                alt=""
              />
            </span>
            <span translate="no">{technology.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LandingToolkit() {
  return (
    <section id="tech-stack" className="lp-toolkit" aria-labelledby="lp-toolkit-title">
      <div className="landing-container lp-toolkit-layout">
        <h2 id="lp-toolkit-title">{technologyStackCopy.title}</h2>
        <div className="lp-technology-groups">
          <TechnologyRow title={technologyStackCopy.mern} technologies={mernStack} primary />
          {supportingTechnologies.map((group) => (
            <TechnologyRow key={group.label} title={group.label} technologies={group.technologies} />
          ))}
          <TechnologyRow title={technologyStackCopy.cloud} technologies={cloudPlatforms} />
        </div>
      </div>
    </section>
  );
}
