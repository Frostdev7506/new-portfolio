import { projects } from "@/data/projects";
import { NotebookHero } from "@/components/home/notebook-hero";
import { ProjectIndex } from "@/components/projects/project-index";
import { AboutSummary } from "@/components/home/about-summary";
import { Experience } from "@/components/about/experience";
import { Toolkit } from "@/components/about/toolkit";
import { ArticleUpdates } from "@/components/shared/article-updates";

export default function HomePage() {
  return (
    <>
      <NotebookHero />
      <ProjectIndex projects={projects.slice(0, 3)} />
      <AboutSummary />
      <Toolkit compact />
      <Experience />
      <ArticleUpdates />
    </>
  );
}
