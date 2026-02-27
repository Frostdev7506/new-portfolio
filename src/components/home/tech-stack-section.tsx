import Image from "next/image";
import { Layers } from "lucide-react";
import { techStackData } from "@/data/tech-stack";
import { SectionHeading } from "@/components/shared/section-heading";
import { SnapCarousel } from "@/components/shared/snap-carousel";

export function TechStackSection() {
  return (
    <section id="tech-stack" className="space-y-8">
      <SectionHeading
        label="Tooling"
        title="Technology Stack"
        description="A curated technical toolkit shaped for speed, reliability, and scale across frontend, backend, cloud, and testing."
      />

      <div className="rounded-3xl border border-border bg-[linear-gradient(145deg,rgba(30,64,175,0.15),rgba(15,23,42,0.9),rgba(17,24,39,0.92))] px-3 py-4 sm:px-4 sm:py-5">
        <SnapCarousel ariaLabel="technology stack cards" itemClassName="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[30%] xl:w-[24%]">
          {techStackData.map((tech) => (
            <article
              key={tech.title}
              className="group h-full rounded-2xl border border-border bg-slate-950/85 p-5 shadow-[0_20px_54px_-45px_rgba(14,165,233,0.8)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/90">
                <Image
                  src={tech.imageUrl}
                  alt={`${tech.title} logo`}
                  width={30}
                  height={30}
                  loading="lazy"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-100">{tech.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{tech.description}</p>

              <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/80 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-cyan-200">
                <Layers className="h-3.5 w-3.5" />
                Production Ready
              </p>
            </article>
          ))}
        </SnapCarousel>
      </div>
    </section>
  );
}
