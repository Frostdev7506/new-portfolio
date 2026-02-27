import { achievements } from "@/data/achievements";
import { SectionHeading } from "@/components/shared/section-heading";
import { SnapCarousel } from "@/components/shared/snap-carousel";

export function AchievementsSection() {
  return (
    <section className="space-y-8 rounded-3xl border border-border bg-[linear-gradient(155deg,rgba(6,182,212,0.14),rgba(15,23,42,0.92),rgba(2,6,23,0.95))] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
      <SectionHeading
        label="Key Accomplishments"
        title="Execution Highlights"
        description="Proof points from production delivery."
      />

      <SnapCarousel
        ariaLabel="achievement highlights"
        itemClassName="w-[88%] shrink-0 snap-start sm:w-[56%] lg:w-[42%] xl:w-[33%]"
        autoScroll
      >
        {achievements.map((achievement, index) => (
          <article
            key={achievement.title}
            className="h-full rounded-2xl border border-border bg-slate-950/85 p-5 shadow-[0_22px_60px_-46px_rgba(34,211,238,0.8)]"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold text-slate-100">{achievement.title}</h3>
              <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-3 rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm font-medium text-cyan-200">
              {achievement.metrics}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {achievement.keywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-slate-700/80 bg-slate-900/70 px-2.5 py-1 text-xs text-slate-300"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <p className="text-clip-2 mt-3 text-sm leading-relaxed text-slate-300">
              {achievement.description}
            </p>
          </article>
        ))}
      </SnapCarousel>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Years Experience", value: "4+" },
          { label: "Projects Delivered", value: "50+" },
          { label: "Teams Collaborated", value: "15+" },
          { label: "Tech Stack Breadth", value: "25+" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-slate-950/80 px-4 py-3 text-center"
          >
            <p className="text-2xl font-semibold text-slate-100">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-300">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
