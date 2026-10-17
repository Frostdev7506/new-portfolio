import Image from "next/image";
import type { Project } from "@/data/projects";
import { TextLink } from "@/components/shared/text-link";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="project-cover-link"
        aria-label={"Open " + project.title}
      >
        <Image
          src={project.image}
          alt={project.altText}
          width={960}
          height={540}
          className="project-cover"
          sizes="(max-width: 700px) 90vw, (max-width: 1400px) 43vw, 616px"
        />
      </a>
      <div className="project-copy">
        <h2>
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            {project.title}
          </a>
        </h2>
        <p>{project.description}</p>
        <ul className="project-technologies" aria-label="Technologies">
          {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
        <TextLink href={project.link} external>
          {project.linkLabel}
        </TextLink>
      </div>
    </article>
  );
}
