import { aspirations } from "@/data/aspirations";
import { Separator } from "@/components/ui/separator";

export function AspirationsSection() {
  return (
    <section className="py-24 lg:py-32 border-b border-border/40">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h2 className="text-4xl font-black tracking-tighter sm:text-5xl uppercase mb-4">Focus</h2>
          <p className="text-muted-foreground/80 max-w-md font-light tracking-wide">
            Core principles guiding engineering trade-offs and architectural decisions.
          </p>
        </div>
        <div className="hidden md:block text-[10px] uppercase tracking-[0.4em] font-bold text-muted-foreground/30 text-right">
          05 // Principles
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-px bg-border/40 border border-border/40">
        {aspirations.map((aspiration, index) => (
          <article
            key={aspiration.title}
            className="bg-background p-8 md:p-12 hover:bg-muted/5 transition-colors duration-500 relative group"
          >
            <div className="text-[10px] font-mono tracking-[0.3em] text-muted-foreground/40 uppercase mb-8 group-hover:text-primary/60 transition-colors">
              P — {String(index + 1).padStart(2, "0")}
            </div>
            <h3 className="text-xl font-bold tracking-tight uppercase mb-4 group-hover:text-primary transition-colors">
              {aspiration.title}
            </h3>
            <Separator className="w-12 bg-border mb-6 group-hover:bg-primary/50 transition-colors" />
            <p className="text-sm leading-relaxed text-muted-foreground/80 font-light">
              {aspiration.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
