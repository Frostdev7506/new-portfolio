import { getPostBySlug } from "@/lib/posts";
import { notebook } from "@/data/notebook";
import { projects } from "@/data/projects";
import { FeaturedArticle } from "@/components/blog/featured-article";
import { NotebookHero } from "@/components/home/notebook-hero";
import { ProjectIndex } from "@/components/projects/project-index";
import { AboutSummary } from "@/components/home/about-summary";
import { Experience } from "@/components/about/experience";
import { Toolkit } from "@/components/about/toolkit";
import { ContactPostcard } from "@/components/shared/contact-postcard";

export default async function HomePage() {
  const featured = await getPostBySlug(notebook.featuredSlug);

  return (
    <>
      <NotebookHero />
      {featured && <FeaturedArticle post={featured} home />}
      <ProjectIndex projects={projects.slice(0, 3)} />
      <AboutSummary />
      <Toolkit compact />
      <Experience />
      <ContactPostcard />
    </>
  );
}
