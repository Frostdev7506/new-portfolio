import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/shared/section-heading";
import { SnapCarousel } from "@/components/shared/snap-carousel";

export function PortfolioSection() {
  return (
    <section id="portfolio" className="space-y-8">
      <SectionHeading
        label="Portfolio"
        title="Featured Project Work"
        description="Swipe or scroll through highlighted builds engineered for business impact, reliability, and scale."
      />

      <div className="rounded-3xl border border-border bg-[linear-gradient(140deg,rgba(14,165,233,0.12),rgba(30,41,59,0.55),rgba(15,23,42,0.92))] px-3 py-4 sm:px-4 sm:py-5">
        <SnapCarousel
          ariaLabel="featured portfolio projects"
          itemClassName="w-[88%] shrink-0 snap-start sm:w-[58%] lg:w-[43%] xl:w-[36%]"
        >
          {projects.map((project) => (
            <article
              key={project.title}
              className="group h-full overflow-hidden rounded-2xl border border-border bg-slate-950/85 shadow-[0_22px_60px_-44px_rgba(56,189,248,0.7)]"
            >
              <div className="relative h-52 overflow-hidden sm:h-56">
                <Image
                  src={project.image}
                  alt={project.altText}
                  fill
                  className="object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 86vw, (max-width: 1024px) 56vw, 38vw"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />
                <p className="absolute bottom-3 left-3 rounded-full border border-slate-700/80 bg-slate-950/80 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-cyan-200">
                  Project Snapshot
                </p>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-100">{project.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{project.description}</p>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-slate-900/75 px-3.5 py-2 text-sm font-medium text-slate-100 transition duration-200 hover:border-brand-300/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  View Case Study
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </SnapCarousel>
      </div>
    </section>
  );
}
