import Image from "next/image";
import { Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/data/site";

export function HeroSection() {
  return (
    <section
      id="about"
      className="surface-panel rise-on-load relative overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_15%_20%,rgba(222,111,73,0.16),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(14,118,105,0.2),transparent_32%),radial-gradient(circle_at_45%_95%,rgba(15,23,42,0.08),transparent_42%)] px-6 py-12 md:px-10 md:py-16"
    >
      <div className="pointer-events-none absolute inset-y-8 right-[8%] hidden w-48 rounded-full bg-[color-mix(in_srgb,var(--brand-300)_32%,transparent)] blur-3xl lg:block" />
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:bg-slate-900/75 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Available for full-time roles
          </p>

          <h1 className="mt-6 max-w-2xl text-pretty text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl md:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="mt-3 text-xl font-medium text-[color:var(--accent)]">{siteConfig.role}</p>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {siteConfig.longDescription}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {siteConfig.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border bg-white/85 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-900/85 dark:text-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-8 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-3">
            {siteConfig.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-white/80 px-4 py-3 dark:bg-slate-900/80"
              >
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={siteConfig.resumeUrl}
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              View Resume
            </a>
            <a
              href="#contact"
              className="rounded-full border border-border bg-white/85 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:bg-slate-900/85 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Let&apos;s Connect
            </a>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/85 text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-900 dark:bg-slate-900/85 dark:text-slate-200"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/85 text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-900 dark:bg-slate-900/85 dark:text-slate-200"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              aria-label="Email"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/85 text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-900 dark:bg-slate-900/85 dark:text-slate-200"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-border bg-white/80 p-3 shadow-sm dark:bg-slate-900/75">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/dev-ed-wave.png"
                alt="Neeraj Butola developer portrait"
                fill
                className="object-cover saturate-105"
                priority
                sizes="(max-width: 1024px) 70vw, 420px"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white/80 px-4 py-4 text-sm text-slate-600 dark:bg-slate-900/75 dark:text-slate-300">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Recent impact</p>
            <ul className="mt-3 space-y-2">
              <li>40% faster workflow creation across integrations.</li>
              <li>99.9% uptime for fintech-grade services.</li>
              <li>30% fewer deployment errors with CI/CD automation.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
