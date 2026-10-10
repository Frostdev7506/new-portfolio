import Image from "next/image";
import { Circle } from "lucide-react";
import type { Project } from "@/data/projects";
import { TextLink } from "@/components/shared/text-link";

export function ProjectPreview({ project }: { project: Project }) {
  return (
    <>
      <div className="project-browser">
        <div className="project-browser-bar">
          <span className="window-controls" aria-hidden="true">
            <Circle /><Circle /><Circle />
          </span>
          <span>{project.title}</span>
        </div>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={project.linkLabel + ": " + project.title}
        >
          <Image
            src={project.image}
            alt={project.altText}
            width={960}
            height={540}
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 60vw, 700px"
            className="project-preview-image"
          />
        </a>
      </div>
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
