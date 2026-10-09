import { getPostBySlug } from "@/lib/posts";
import { personJsonLd } from "@/lib/seo";
import { notebook } from "@/data/notebook";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { FeaturedArticle } from "@/components/blog/featured-article";
import { ProjectCard } from "@/components/projects/project-card";
import { AboutIntro } from "@/components/about/about-intro";
import { Experience } from "@/components/about/experience";
import { Toolkit } from "@/components/about/toolkit";
import { ContactBanner } from "@/components/shared/contact-banner";
import { TextLink } from "@/components/shared/text-link";

export default async function HomePage() {
  const featured = await getPostBySlug(notebook.featuredSlug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      {featured && <FeaturedArticle post={featured} home />}
      <section id="portfolio" className="selected-projects section-block">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">From the workbench.</p>
            <h2>Selected projects</h2>
          </div>
          <TextLink href={siteConfig.social.github} external>
            GitHub
          </TextLink>
        </div>
        <div className="project-list">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard
              headingLevel="h3"
              project={project}
              key={project.title}
            />
          ))}
        </div>
        <TextLink href="/projects">See all projects</TextLink>
      </section>
      <AboutIntro compact />
      <Toolkit compact />
      <Experience />
      <ContactBanner />
    </>
  );
}
