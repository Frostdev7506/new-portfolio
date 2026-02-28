import { achievements } from "@/data/achievements";

export function AchievementsSection() {
  return (
    <section className="py-24 lg:py-32 border-b border-border/40">
      <div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap gap-16">

        <div className="w-full lg:w-1/3">
          <div className="sticky top-24">
            <h2 className="text-4xl font-black tracking-tighter sm:text-5xl uppercase mb-4">Execution</h2>
            <p className="text-muted-foreground/80 font-light tracking-wide mb-12">
              Proof points from production delivery.
            </p>
            <div className="hidden lg:block text-[10px] uppercase tracking-[0.4em] font-bold text-muted-foreground/30">
              04 // Proof
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-px bg-border/40 border border-border/40">
          {achievements.map((achievement, index) => (
            <article
              key={achievement.title}
              className="group bg-background p-8 md:p-12 hover:bg-muted/5 transition-colors duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 text-8xl font-black text-muted/20 select-none group-hover:text-primary/5 transition-colors duration-500 z-0 leading-none">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold tracking-tight uppercase group-hover:text-primary transition-colors duration-300 mb-2">
                  {achievement.title}
                </h3>
                <div className="text-[10px] font-mono tracking-[0.2em] text-primary/80 uppercase mb-6">
                  {achievement.metrics}
                </div>

                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground/80 font-light mb-8">
                  {achievement.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {achievement.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="text-[9px] uppercase tracking-[0.15em] font-medium border border-border/50 text-muted-foreground/60 px-2 py-1 bg-background group-hover:border-primary/20 transition-colors"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40 border border-border/40">
        {[
          { label: "Years Exp", value: "4+" },
          { label: "Shipped", value: "50+" },
          { label: "Teams", value: "15+" },
          { label: "Tech Stack", value: "25+" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-background p-8 text-center flex flex-col items-center justify-center hover:bg-muted/5 transition-colors duration-500"
          >
            <p className="text-4xl font-black tracking-tighter text-foreground mb-2">{stat.value}</p>
            <p className="text-[10px] uppercase tracking-[0.25em] font-medium text-muted-foreground/50">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
