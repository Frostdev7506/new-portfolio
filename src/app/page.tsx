import { personJsonLd } from "@/lib/seo";
import { projects } from "@/data/projects";
import { NotebookHero } from "@/components/home/notebook-hero";
import { ProjectIndex } from "@/components/projects/project-index";
import { AboutSummary } from "@/components/home/about-summary";
import { Experience } from "@/components/about/experience";
import { Toolkit } from "@/components/about/toolkit";
import { ContactPostcard } from "@/components/shared/contact-postcard";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      <NotebookHero />
      <ProjectIndex projects={projects.slice(0, 3)} />
      <AboutSummary />
      <Toolkit compact />
      <Experience />
      <ContactPostcard />
    </>
  );
}
