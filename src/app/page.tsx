import { getPostBySlug } from "@/lib/posts";
import { personJsonLd } from "@/lib/seo";
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      <NotebookHero />
      <ProjectIndex projects={projects.slice(0, 3)} />
      {featured && <FeaturedArticle post={featured} home />}
      <AboutSummary />
      <Toolkit compact />
      <Experience />
      <ContactPostcard />
    </>
  );
}
