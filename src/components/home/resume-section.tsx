import { ArrowDownRight } from "lucide-react";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";

export function ResumeSection() {
  const resumeFileUrl = siteConfig.resumeUrl.startsWith("http")
    ? siteConfig.resumeUrl
    : `${siteConfig.url}${siteConfig.resumeUrl}`;

  return (
    <section className="py-24 lg:py-40 border-b border-border/40 bg-muted/5">
      <div className="max-w-4xl mx-auto text-center px-4">
        <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted-foreground/40 mb-8">
          06 // Résumé
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8">
          Full Résumé
        </h2>
        <p className="text-muted-foreground/80 font-light tracking-wide max-w-lg mx-auto mb-16 leading-relaxed">
          Comprehensive overview of experience, education, and technical proficiency available for offline review.
        </p>

        <Button
          asChild
          size="lg"
          className="h-16 px-12 rounded-none text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-primary/90 hover:scale-[1.02] transition-all duration-500"
        >
          <a href={resumeFileUrl} target="_blank" rel="noreferrer">
            Download PDF
            <ArrowDownRight className="ml-4 h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  );
}
