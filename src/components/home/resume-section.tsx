"use client";

import { ArrowDownRight, FileText } from "lucide-react";
import { siteConfig } from "@/data/site";
import { motion, Variants } from "framer-motion";

export function ResumeSection() {
  const resumeFileUrl = siteConfig.resumeUrl.startsWith("http")
    ? siteConfig.resumeUrl
    : `${siteConfig.url}${siteConfig.resumeUrl}`;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="py-24 lg:py-40 border-b border-border/40 relative overflow-hidden bg-background">
      {/* Background glow resembling Hero Section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">

          {/* Left Column: Heading & Description */}
          <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col justify-center">
            <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted-foreground/40 mb-8 flex items-center gap-4">
              <span className="w-8 h-px bg-border"></span>
              06 // Résumé
            </div>

            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase mb-8 leading-[0.9] text-foreground">
              Comprehensive
              <span className="block text-primary">Dossier</span>
            </h2>

            <p className="text-muted-foreground/80 font-light tracking-wide max-w-xl text-lg leading-relaxed mb-6">
              A detailed catalog of professional experience, education, and technical proficiency,
              synthesized for offline review and rigorous evaluation.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              {[
                "Full-Stack",
                "Architecture",
                "Leadership",
                "Sys Design"
              ].map((tag, idx) => (
                <span key={idx} className="text-[10px] uppercase tracking-[0.2em] font-medium border border-border/50 text-muted-foreground/60 px-3 py-1.5 bg-background">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Brutalist Download Action */}
          <motion.div variants={itemVariants} className="lg:col-span-5 h-full">
            <a
              href={resumeFileUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative block w-full h-full min-h-[300px] bg-border/40 border border-border/40 p-1 hover:bg-primary/5 transition-colors duration-700 mx-auto"
            >
              {/* Inner content block (stark brutalist box) */}
              <div className="w-full h-full bg-background border border-border/40 flex flex-col items-center justify-center p-12 text-center group-hover:border-primary/40 transition-colors duration-700 relative overflow-hidden">

                {/* Implied data scanning effect on hover */}
                <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1] pointer-events-none" />

                <FileText className="h-16 w-16 mb-8 text-muted-foreground/20 group-hover:text-primary transition-colors duration-500" />

                <h3 className="text-2xl font-bold tracking-tighter uppercase mb-4 relative z-10 group-hover:text-primary transition-colors duration-500">
                  Secure PDF
                </h3>

                <p className="text-sm text-muted-foreground/60 font-mono tracking-widest uppercase mb-12 relative z-10">
                  Version 4.2.0 • 120KB
                </p>

                <motion.div
                  className="mt-auto relative z-10 w-16 h-16 border border-border/60 rounded-full flex items-center justify-center bg-background group-hover:bg-primary group-hover:border-primary transition-all duration-500"
                >
                  <ArrowDownRight className="h-6 w-6 text-foreground group-hover:text-primary-foreground group-hover:-rotate-45 transition-all duration-500" />
                </motion.div>

                {/* Corner Accents */}
                <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
