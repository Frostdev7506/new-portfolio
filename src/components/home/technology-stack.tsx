import Image from "next/image";
import {
  cloudPlatforms,
  mernStack,
  supportingTechnologies,
  technologyStackCopy,
  type Technology,
} from "@/data/technology-stack";

function TechnologyList({
  technologies,
  className,
}: {
  technologies: readonly Technology[];
  className: string;
}) {
  return (
    <ul className={className}>
      {technologies.map((technology) => (
        <li key={technology.name}>
          <span className="technology-logo" data-logo={technology.logo}>
            <Image
              src={`/technology-logos/${technology.logo}.svg`}
              alt=""
              width={64}
              height={64}
            />
          </span>
          <span className="technology-identity">
            <span className="technology-name" translate="no">{technology.name}</span>
            {technology.role && (
              <span className="technology-role">{technology.role}</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function TechnologyStack() {
  return (
    <section
      id="tech-stack"
      className="technology-stack"
      aria-labelledby="technology-stack-title"
    >
      <header className="technology-stack-heading">
        <h2 id="technology-stack-title">{technologyStackCopy.title}</h2>
      </header>

      <div className="technology-stack-overview">
        <div className="technology-mern">
          <h3>{technologyStackCopy.mern}</h3>
          <TechnologyList technologies={mernStack} className="technology-core" />
        </div>
        <div className="technology-cloud">
          <h3>{technologyStackCopy.cloud}</h3>
          <TechnologyList
            technologies={cloudPlatforms}
            className="technology-cloud-list"
          />
        </div>
      </div>

      <div className="technology-supporting">
        {supportingTechnologies.map((group) => (
          <div className="technology-tool-row" key={group.label}>
            <h3>{group.label}</h3>
            <TechnologyList
              technologies={group.technologies}
              className="technology-tools"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
