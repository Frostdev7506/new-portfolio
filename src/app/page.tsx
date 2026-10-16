import { projects } from "@/data/projects";
import { NotebookHero } from "@/components/home/notebook-hero";
import { ProjectIndex } from "@/components/projects/project-index";
import { AboutSummary } from "@/components/home/about-summary";
import { Experience } from "@/components/about/experience";
import { TechnologyStack } from "@/components/home/technology-stack";
import { ContactPostcard } from "@/components/shared/contact-postcard";
import { ArticleUpdates } from "@/components/shared/article-updates";

export default function HomePage() {
  return (
    <>
      <NotebookHero />
      <ProjectIndex projects={projects.slice(0, 3)} />
      <TechnologyStack />
      <Experience />
      <ContactPostcard />
      <AboutSummary />
      <ArticleUpdates />
    </>
  );
}
