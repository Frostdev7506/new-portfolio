import type { Project } from "@/data/projects";
import { TextLink } from "@/components/shared/text-link";
import { ProjectTabs } from "./project-tabs";

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
      <ProjectTabs projects={projects} />
    </section>
  );
}
