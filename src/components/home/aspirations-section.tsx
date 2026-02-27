import { aspirations } from "@/data/aspirations";
import { SectionHeading } from "@/components/shared/section-heading";

export function AspirationsSection() {
  return (
    <section className="space-y-10">
      <SectionHeading
        label="Focus"
        title="Career Aspirations"
        description="Themes that consistently shape how I approach engineering decisions."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aspirations.map((aspiration) => (
          <article
            key={aspiration.title}
            className="rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {aspiration.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{aspiration.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
