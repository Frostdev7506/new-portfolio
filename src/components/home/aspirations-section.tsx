import { aspirations } from "@/data/aspirations";
import { SectionHeading } from "@/components/shared/section-heading";
import { SnapCarousel } from "@/components/shared/snap-carousel";

export function AspirationsSection() {
  return (
    <section className="space-y-8">
      <SectionHeading
        label="Focus"
        title="What Drives My Engineering Decisions"
        description="Core principles and working styles that keep product development fast, collaborative, and sustainable."
      />

      <SnapCarousel ariaLabel="career focus cards" itemClassName="w-[84%] shrink-0 snap-start sm:w-[49%] lg:w-[32%]">
        {aspirations.map((aspiration) => (
          <article
            key={aspiration.title}
            className="h-full rounded-2xl border border-border bg-slate-950/80 p-5 transition duration-200 hover:border-brand-300/70"
          >
            <h3 className="text-base font-semibold text-slate-100">{aspiration.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{aspiration.text}</p>
          </article>
        ))}
      </SnapCarousel>
    </section>
  );
}
