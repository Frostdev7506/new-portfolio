import { achievements } from "@/data/achievements";
import { SectionHeading } from "@/components/shared/section-heading";

export function AchievementsSection() {
  return (
    <section className="space-y-10 rounded-3xl border border-border bg-gradient-to-b from-white to-slate-50 px-6 py-10 dark:from-slate-950 dark:to-slate-900/70 md:px-8">
      <SectionHeading
        label="Key Accomplishments"
        title="Impact that scales with the product"
        description="Outcomes across cloud architecture, delivery velocity, and platform reliability."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {achievements.map((achievement) => (
          <article
            key={achievement.title}
            className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-slate-900"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{achievement.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {achievement.description}
            </p>
            <p className="mt-3 rounded-xl border border-border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {achievement.metrics}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {achievement.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Years Experience", value: "4+" },
          { label: "Projects Delivered", value: "50+" },
          { label: "Teams Collaborated", value: "15+" },
          { label: "Tech Stack Breadth", value: "25+" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-white px-4 py-3 text-center dark:bg-slate-900"
          >
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
