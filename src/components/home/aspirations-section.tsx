"use client";

import { aspirations } from "@/data/aspirations";
import { Separator } from "@/components/ui/separator";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function AspirationsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section className="py-24 lg:py-32 border-b border-border/40 relative overflow-hidden" ref={containerRef}>
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 relative z-10 w-full">
        <motion.div style={{ y: headerY }}>
          <h2 className="text-4xl font-black tracking-tighter sm:text-5xl uppercase mb-4">Focus</h2>
          <p className="text-muted-foreground/80 max-w-md font-light tracking-wide">
            Core principles guiding engineering trade-offs and architectural decisions.
          </p>
        </motion.div>
        <div className="hidden md:block text-[10px] uppercase tracking-[0.4em] font-bold text-muted-foreground/30 text-right">
          05 // Principles
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-3 gap-px bg-border/40 border border-border/40 relative z-10"
      >
        {aspirations.map((aspiration, index) => (
          <motion.article
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.01 }}
            key={aspiration.title}
            className="bg-background p-8 md:p-12 hover:bg-muted/5 transition-all duration-500 relative group overflow-hidden"
          >
            {/* Hover reveal gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 text-[10px] font-mono tracking-[0.3em] text-muted-foreground/40 uppercase mb-8 group-hover:text-primary/60 transition-colors">
              P — {String(index + 1).padStart(2, "0")}
            </div>
            <h3 className="relative z-10 text-xl font-bold tracking-tight uppercase mb-4 group-hover:text-primary transition-colors">
              {aspiration.title}
            </h3>
            <Separator className="relative z-10 w-12 bg-border mb-6 group-hover:bg-primary/50 transition-colors" />
            <p className="relative z-10 text-sm leading-relaxed text-muted-foreground/80 font-light">
              {aspiration.text}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
