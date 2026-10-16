import type { Project } from "@/data/projects";
import { homeNotebook } from "@/data/notebook";
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
        <h2 id="projects-title">{homeNotebook.projects.title}</h2>
        <TextLink href="/projects">All projects</TextLink>
      </div>
      <ProjectTabs projects={projects} />
    </section>
  );
}
