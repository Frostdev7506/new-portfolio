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
        title="Core Stack"
        description="Tools I ship with every week."
      />

      <div className="rounded-3xl border border-border bg-[linear-gradient(145deg,rgba(30,64,175,0.15),rgba(15,23,42,0.9),rgba(17,24,39,0.92))] px-3 py-4 sm:px-4 sm:py-5">
        <SnapCarousel
          ariaLabel="technology stack cards"
          itemClassName="w-[74%] shrink-0 snap-start sm:w-[42%] lg:w-[29%] xl:w-[23%]"
          autoScroll
          autoScrollIntervalMs={3600}
        >
          {techStackData.map((tech, index) => (
            <article
              key={tech.title}
              className="group h-full rounded-2xl border border-border bg-slate-950/85 p-5 shadow-[0_20px_54px_-45px_rgba(14,165,233,0.8)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/90">
                  <Image
                    src={tech.imageUrl}
                    alt={`${tech.title} logo`}
                    width={30}
                    height={30}
                    loading="lazy"
                  />
                </div>
                <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-100">{tech.title}</h3>
              <p className="text-clip-2 mt-2 text-sm leading-relaxed text-slate-300">{tech.description}</p>

              <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/80 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-cyan-200">
                <Layers className="h-3.5 w-3.5" />
                Shipping Tool
              </p>
            </article>
          ))}
        </SnapCarousel>
      </div>
    </section>
  );
}
