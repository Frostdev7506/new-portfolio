"use client";

import { Tabs } from "radix-ui";
import type { Project } from "@/data/projects";
import { ProjectPreview } from "./project-preview";

export function ProjectTabs({ projects }: { projects: Project[] }) {
  return (
    <Tabs.Root defaultValue="0" orientation="vertical" className="project-explorer">
      <Tabs.List aria-label="Select a project" className="project-index-list">
        {projects.map((project, index) => (
          <Tabs.Trigger
            key={project.title}
            value={String(index)}
            className="project-choice"
          >
            <span className="project-choice-title">{project.title}</span>
            <span className="project-summary">{project.summary}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {projects.map((project, index) => (
        <Tabs.Content
          key={project.title}
          value={String(index)}
          className="project-preview"
        >
          <ProjectPreview project={project} />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
