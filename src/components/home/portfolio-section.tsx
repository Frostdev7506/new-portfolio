import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/shared/section-heading";

export function PortfolioSection() {
  return (
    <section id="portfolio" className="space-y-10">
      <SectionHeading
        label="Work"
        title="Portfolio"
        description="Selected projects across fintech, developer tooling, and product automation."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.title}
            className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:bg-slate-900"
          >
            <div className="relative h-52 overflow-hidden">
              <Image
                src={project.image}
                alt={project.altText}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{project.title}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {project.description}
              </p>

              <a
                href={project.link}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition hover:text-brand-900 dark:text-brand-300 dark:hover:text-brand-100"
              >
                View {project.title}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
