"use client";

import Image from "next/image";
import { Tabs } from "radix-ui";
import { ArrowRight, Circle } from "lucide-react";
import type { Project } from "@/data/projects";
import { TextLink } from "@/components/shared/text-link";

export function ProjectIndex({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <section
      id="portfolio"
      className="project-index section-block"
      aria-labelledby="projects-title"
    >
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">From the workbench.</p>
          <h2 id="projects-title">Selected projects.</h2>
        </div>
        <TextLink href="/projects">All projects</TextLink>
      </div>
      <p className="project-index-intro">
        A few things I’ve built, connected, and learned from.
      </p>
      <Tabs.Root defaultValue="0" orientation="vertical" className="project-explorer">
        <Tabs.List aria-label="Select a project" className="project-index-list">
          {projects.map((project, index) => (
            <Tabs.Trigger
              key={project.title}
              value={String(index)}
              className="project-choice"
            >
              <span className="project-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="project-choice-title">{project.title}</span>
              <span className="project-summary">{project.summary}</span>
              <ArrowRight size={22} aria-hidden="true" />
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {projects.map((project, index) => (
          <Tabs.Content
            key={project.title}
            value={String(index)}
            className="project-preview"
          >
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
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </section>
  );
}
