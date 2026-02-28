import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PortfolioSection() {
  return (
    <section id="portfolio" className="py-24 lg:py-32 border-b border-border/40">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h2 className="text-4xl font-black tracking-tighter sm:text-5xl uppercase mb-4">Featured Work</h2>
          <p className="text-muted-foreground max-w-md font-light tracking-wide leading-relaxed">
            A selection of projects that demonstrate my approach to problem-solving and technical execution.
          </p>
        </div>
        <div className="hidden md:block text-xs uppercase tracking-[0.3em] font-medium text-muted-foreground/40 text-right">
          01 // Portfolio
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <a href={project.link} target="_blank" rel="noreferrer" key={project.title} className="group block focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-4 focus:ring-offset-background rounded-none">
            <Card className="h-full bg-background border-border/40 hover:bg-muted/5 transition-colors duration-500 rounded-none overflow-hidden relative shadow-none">
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <div className="bg-background/90 backdrop-blur-md p-2 rounded-none border border-border shadow-sm">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border/40">
                <Image
                  src={project.image}
                  alt={project.altText}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 filter grayscale-[0.8] group-hover:grayscale-0 opacity-90 group-hover:opacity-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <CardHeader className="pt-6 pb-2 px-6">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h3 className="text-xl font-bold tracking-tight uppercase group-hover:text-primary transition-colors">{project.title}</h3>
                  <span className="text-[10px] font-mono tracking-widest text-muted-foreground/40 mt-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground/80 leading-relaxed font-light line-clamp-2">
                  {project.description}
                </p>
              </CardHeader>

              <CardContent className="pb-6 px-6">
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="secondary" className="rounded-none bg-muted/30 hover:bg-muted/50 text-[9px] tracking-[0.2em] uppercase font-medium border-border/30">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
