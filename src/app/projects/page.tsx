import { projects } from "@/data/projects";
import { notebook } from "@/data/notebook";
import { siteConfig } from "@/data/site";
import { ProjectCard } from "@/components/projects/project-card";
import { PageIntro } from "@/components/shared/page-intro";
import { TextLink } from "@/components/shared/text-link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Projects",
  description: notebook.projectsDescription,
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <PageIntro
        eyebrow="From the workbench."
        title="Projects"
        description={notebook.projectsDescription}
        image="/illustrations/projects.png"
      />
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
      <div className="closing-line">
        <p>More code, experiments, and unfinished ideas.</p>
        <TextLink href={siteConfig.social.github} external>
          Explore GitHub
        </TextLink>
      </div>
    </>
  );
}
