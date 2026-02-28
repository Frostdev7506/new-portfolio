import Image from "next/image";
import { ArrowRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section id="about" className="relative pb-24 pt-32 lg:pb-32 lg:pt-48 border-b border-border/40">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8 flex flex-col items-start justify-center">
          <Badge variant="outline" className="mb-8 rounded-none px-4 py-1.5 text-[0.65rem] tracking-[0.3em] uppercase text-muted-foreground border-primary/20 bg-primary/5">
            Portfolio-First Full-Stack Engineer
          </Badge>

          <h1 className="text-6xl font-black tracking-tighter sm:text-7xl lg:text-8xl w-full max-w-[12ch] leading-[0.9] mb-8 uppercase">
            <span className="block text-primary">{siteConfig.name}</span>
            <span className="block text-muted-foreground/30 font-light mt-2 tracking-tight">{siteConfig.role}</span>
          </h1>

          <p className="max-w-md text-base text-muted-foreground leading-relaxed font-light mb-12 tracking-wide">
            {siteConfig.longDescription}
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <Button size="lg" className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-xs tracking-widest uppercase">
              Explore Portfolio
              <ArrowRight className="ml-3 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-none border-border hover:bg-muted/50 h-12 text-xs tracking-widest uppercase">
              <a href={siteConfig.resumeUrl}>Résumé</a>
            </Button>
          </div>

          <div className="mt-20 flex items-center gap-8 text-muted-foreground">
            <a href={siteConfig.social.github} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="h-4 w-4" />
            </a>
            <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-4 w-4" />
            </a>
            <a href={`mailto:${siteConfig.email}`} className="hover:text-primary transition-colors">
              <span className="sr-only">Email</span>
              <Mail className="h-4 w-4" />
            </a>
            <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.2em] font-medium ml-4">
              <MapPin className="h-3 w-3" />
              {siteConfig.location}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 relative flex items-end justify-end">
          <div className="relative aspect-[3/4] w-full max-w-sm ml-auto overflow-hidden grayscale contrast-125 mix-blend-luminosity opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-700 ease-in-out">
            <Image
              src="/dev-ed-wave.png"
              alt={siteConfig.name}
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 border border-border mix-blend-overlay"></div>
          </div>

          <div className="absolute top-0 right-full -mr-8 hidden lg:block origin-bottom-right -rotate-90 text-[10px] tracking-[0.5em] text-muted-foreground/30 whitespace-nowrap uppercase">
            Intentional Minimalism • Zero Fluff
          </div>
        </div>
      </div>
    </section>
  );
}
