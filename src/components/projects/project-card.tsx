import Image from "next/image";
import type { Project } from "@/data/projects";
import { TextLink } from "@/components/shared/text-link";

export function ProjectCard({
  project,
  headingLevel = "h2",
}: {
  project: Project;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
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
          sizes="(max-width: 900px) 100vw, (max-width: 1200px) 40vw, 600px"
        />
      </a>
      <div className="project-copy">
        <Heading>
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            {project.title}
          </a>
        </Heading>
        <p>{project.description}</p>
        <p className="project-technologies">
          {project.technologies.join(" · ")}
        </p>
        <TextLink href={project.link} external>
          {project.linkLabel}
        </TextLink>
      </div>
    </article>
  );
}
