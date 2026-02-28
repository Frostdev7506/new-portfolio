"use client";

import Image from "next/image";
import { ArrowRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, Variants } from "framer-motion";

export function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <section id="about" className="relative pb-24 pt-32 lg:pb-32 lg:pt-48 border-b border-border/40 overflow-hidden">
      {/* Ambient floating background glow */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="grid gap-16 lg:grid-cols-12 lg:gap-8 relative z-10">
        <motion.div
          className="lg:col-span-8 flex flex-col items-start justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="outline" className="mb-8 rounded-none px-4 py-1.5 text-[0.65rem] tracking-[0.3em] uppercase text-muted-foreground border-primary/20 bg-primary/5">
              Portfolio-First Full-Stack Engineer
            </Badge>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-6xl font-black tracking-tighter sm:text-7xl lg:text-8xl w-full max-w-[12ch] leading-[0.9] mb-8 uppercase">
            <span className="block text-primary">{siteConfig.name}</span>
            <span className="block text-muted-foreground/30 font-light mt-2 tracking-tight">{siteConfig.role}</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="max-w-md text-base text-muted-foreground leading-relaxed font-light mb-12 tracking-wide">
            {siteConfig.longDescription}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 items-center">
            <Button size="lg" className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-xs tracking-widest uppercase transition-all hover:scale-105 active:scale-95 duration-300">
              Explore Portfolio
              <ArrowRight className="ml-3 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-none border-border hover:bg-muted/50 h-12 text-xs tracking-widest uppercase transition-all hover:scale-105 active:scale-95 duration-300">
              <a href={siteConfig.resumeUrl}>Résumé</a>
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-20 flex items-center gap-8 text-muted-foreground">
            {[
              { icon: Github, href: siteConfig.social.github, label: "GitHub" },
              { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
              { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email" }
            ].map((social, index) => (
              <motion.a
                key={index}
                whileHover={{ y: -4, color: "var(--primary)" }}
                transition={{ type: "spring", stiffness: 300 }}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                className="hover:text-primary transition-colors block"
              >
                <span className="sr-only">{social.label}</span>
                <social.icon className="h-4 w-4" />
              </motion.a>
            ))}
            <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.2em] font-medium ml-4">
              <MapPin className="h-3 w-3" />
              {siteConfig.location}
            </div>
          </motion.div>
        </motion.div>

        <div className="lg:col-span-4 relative flex items-end justify-end">
          <motion.div
            initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="relative aspect-[3/4] w-full max-w-sm ml-auto overflow-hidden grayscale contrast-125 mix-blend-luminosity opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-700 ease-in-out group"
          >
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <Image
                src="/dev-ed-wave.png"
                alt={siteConfig.name}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                priority
              />
            </motion.div>
            <div className="absolute inset-0 border border-border mix-blend-overlay pointer-events-none"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute top-0 right-full -mr-8 hidden lg:block origin-bottom-right -rotate-90 text-[10px] tracking-[0.5em] text-muted-foreground/30 whitespace-nowrap uppercase"
          >
            Intentional Minimalism • Zero Fluff
          </motion.div>
        </div>
      </div>
    </section>
  );
}
