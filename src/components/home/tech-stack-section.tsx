"use client";

import Image from "next/image";
import { techStackData } from "@/data/tech-stack";
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

export function TechStackSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section id="tech-stack" className="py-24 lg:py-32 border-b border-border/40 relative overflow-hidden" ref={containerRef}>
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 relative z-10 w-full">
        <motion.div style={{ y: headerY }}>
          <h2 className="text-4xl font-black tracking-tighter sm:text-5xl uppercase mb-6">Core Stack</h2>
          <p className="text-muted-foreground/80 max-w-md font-light tracking-wide text-lg">
            Tools and technologies I rely on to ship production-ready applications with modern workflows.
          </p>
        </motion.div>
        <div className="hidden md:block text-xs uppercase tracking-[0.3em] font-medium text-muted-foreground/40 text-right">
          03 // Tooling
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 relative z-10"
      >
        {techStackData.map((tech) => (
          <motion.div
            key={tech.title}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative bg-muted/30 border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center aspect-square overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)]"
          >
            {/* Hover reveal gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 mb-4 transform group-hover:scale-110 transition-transform duration-500 ease-out flex-shrink-0">
              <Image
                src={tech.imageUrl}
                alt={`${tech.title} logo`}
                fill
                className="object-contain drop-shadow-sm filter grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>

            <h3 className="relative z-10 text-[11px] md:text-sm uppercase tracking-widest font-bold text-foreground/80 group-hover:text-primary transition-colors duration-300 text-center mb-1">
              {tech.title}
            </h3>

            <div className="hidden md:block relative z-10 h-0 overflow-hidden group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 mt-2">
              <p className="text-[10px] tracking-wide font-light text-center leading-relaxed text-muted-foreground/90">
                {tech.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
