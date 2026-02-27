import Image from "next/image";
import { techStackData } from "@/data/tech-stack";
import { SectionHeading } from "@/components/shared/section-heading";

export function TechStackSection() {
  return (
    <section id="tech-stack" className="space-y-10">
      <SectionHeading
        label="Tooling"
        title="Technology Stack"
        description="Production-ready technologies used to ship reliable and maintainable software."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {techStackData.map((tech) => (
          <article
            key={tech.title}
            className="group rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:bg-slate-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-slate-50 dark:bg-slate-800">
              <Image
                src={tech.imageUrl}
                alt={`${tech.title} logo`}
                width={30}
                height={30}
                loading="lazy"
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{tech.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {tech.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
