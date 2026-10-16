import Image from "next/image";
import type { Project } from "@/data/projects";
import { TextLink } from "@/components/shared/text-link";

export function ProjectPreview({ project }: { project: Project }) {
  return (
    <>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="project-preview-link"
        aria-label={project.linkLabel + ": " + project.title}
      >
        <Image
          src={project.image}
          alt={project.altText}
          width={960}
          height={540}
          sizes="(max-width: 760px) 100vw, (max-width: 900px) 60vw, (max-width: 1100px) 70vw, 700px"
          className="project-preview-image"
        />
      </a>
      <p className="project-preview-description">{project.description}</p>
      <p className="project-technologies">
        {project.technologies.join(" · ")}
      </p>
      <TextLink href={project.link} external>
        {project.linkLabel}
      </TextLink>
    </>
  );
}
