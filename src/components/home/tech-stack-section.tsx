import Image from "next/image";
import { techStackData } from "@/data/tech-stack";

export function TechStackSection() {
  return (
    <section id="tech-stack" className="py-24 lg:py-32 border-b border-border/40">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h2 className="text-4xl font-black tracking-tighter sm:text-5xl uppercase mb-4">Core Stack</h2>
          <p className="text-muted-foreground/80 max-w-md font-light tracking-wide">
            Tools and technologies I rely on to ship production-ready applications.
          </p>
        </div>
        <div className="hidden md:block text-xs uppercase tracking-[0.3em] font-medium text-muted-foreground/40 text-right">
          03 // Tooling
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-px bg-border/40 border border-border/40">
        {techStackData.map((tech) => (
          <div
            key={tech.title}
            className="group relative bg-background p-6 flex flex-col items-center justify-center aspect-square hover:bg-muted/5 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />

            <div className="relative z-10 w-12 h-12 mb-4 grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100 group-hover:scale-110">
              <Image
                src={tech.imageUrl}
                alt={`${tech.title} logo`}
                fill
                className="object-contain"
              />
            </div>

            <h3 className="relative z-10 text-[10px] uppercase tracking-widest font-bold text-muted-foreground group-hover:text-primary transition-colors duration-300 text-center">
              {tech.title}
            </h3>

            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 inset-0 m-auto flex items-center justify-center bg-background/90 backdrop-blur-sm z-20">
              <p className="text-[10px] tracking-wider font-light text-center px-4 leading-relaxed text-muted-foreground">
                {tech.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
