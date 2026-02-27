import Image from "next/image";
import {
  ArrowRight,
  FolderKanban,
  Github,
  Linkedin,
  MapPin,
  Mail,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { siteConfig } from "@/data/site";

export function HeroSection() {
  const snapshotCards = [
    {
      title: "Fintech Automation",
      impact: "40% faster workflow onboarding",
    },
    {
      title: "Cloud Reliability",
      impact: "99.9% production uptime",
    },
    {
      title: "Delivery Quality",
      impact: "30% fewer release incidents",
    },
  ];

  const strengthPoints = [
    {
      icon: FolderKanban,
      title: "Product Thinking",
      detail: "Business outcomes tied to shipped features",
    },
    {
      icon: Rocket,
      title: "Execution Speed",
      detail: "Fast iterations with stable architecture",
    },
    {
      icon: ShieldCheck,
      title: "Engineering Discipline",
      detail: "Security-first defaults and robust CI/CD",
    },
  ];

  return (
    <section
      id="about"
      className="surface-panel relative overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_8%_10%,rgba(56,189,248,0.24),transparent_34%),radial-gradient(circle_at_88%_6%,rgba(59,130,246,0.28),transparent_32%),radial-gradient(circle_at_50%_92%,rgba(20,184,166,0.2),transparent_45%)] px-5 py-10 sm:px-7 sm:py-12 md:px-10 md:py-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]" />
      <div className="pointer-events-none absolute left-[10%] top-14 h-20 w-20 rounded-full bg-cyan-300/20 blur-xl" />
      <div className="pointer-events-none absolute bottom-10 right-[12%] h-28 w-28 rounded-full bg-blue-500/20 blur-2xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <aside className="order-1 rise-on-load lg:order-2">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-cyan-300/30 via-blue-500/20 to-emerald-300/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-slate-950/85 p-3 shadow-[0_28px_80px_-48px_rgba(56,189,248,0.7)]">
              <div className="relative overflow-hidden rounded-[1.6rem] border border-slate-800/80">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(56,189,248,0.28),transparent_36%),radial-gradient(circle_at_88%_84%,rgba(14,165,233,0.3),transparent_40%)]" />
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/dev-ed-wave.png"
                    alt="Neeraj Butola developer portrait"
                    fill
                    className="object-cover object-center saturate-110 contrast-105"
                    priority
                    sizes="(max-width: 1024px) 92vw, 420px"
                  />
                </div>
                <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-slate-700/80 bg-slate-950/85 px-3 py-2 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Current Focus</p>
                  <p className="mt-1 text-sm font-medium text-slate-100">
                    Building resilient full-stack products with measurable outcomes.
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {siteConfig.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-slate-700/80 bg-slate-900/80 px-2 py-2 text-center"
                  >
                    <p className="text-base font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 text-[11px] leading-tight text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute left-2 top-7 rounded-xl border border-slate-700/80 bg-slate-950/85 px-3 py-1.5 text-xs font-medium text-slate-200 sm:-left-4">
              <span className="inline-flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-cyan-300" />
                Build Fast, Ship Stable
              </span>
            </div>
            <div className="pointer-events-none absolute bottom-16 right-2 rounded-xl border border-slate-700/80 bg-slate-950/85 px-3 py-1.5 text-xs font-medium text-slate-200 sm:-right-5">
              99.9% uptime mindset
            </div>
          </div>
        </aside>

        <div className="order-2 lg:order-1">
          <p className="rise-on-load inline-flex items-center gap-2 rounded-full border border-border bg-slate-900/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-brand-300" />
            Portfolio-First Full-Stack Engineer
          </p>

          <h1 className="rise-on-load-delayed mt-5 max-w-2xl text-pretty text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl md:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="rise-on-load-delayed mt-3 text-lg font-medium text-brand-300 sm:text-xl">
            {siteConfig.role}
          </p>
          <p className="rise-on-load-slow mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-slate-300 sm:text-base">
            {siteConfig.longDescription}
          </p>
          <p className="rise-on-load-slow mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-slate-400 sm:text-base">
            This portfolio is engineered to show real product outcomes, not just screenshots.
          </p>

          <div className="rise-on-load-slow mt-7 grid gap-3 sm:flex sm:flex-wrap">
            <a
              href="#portfolio"
              className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto sm:px-6"
            >
              Explore Portfolio
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
            <a
              href={siteConfig.resumeUrl}
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-border bg-slate-900/80 px-5 py-3 text-sm font-medium text-slate-100 transition duration-200 hover:border-brand-300/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto sm:px-6"
            >
              Download Resume
            </a>
            <a
              href="#contact"
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-border bg-slate-900/55 px-5 py-3 text-sm font-medium text-slate-200 transition duration-200 hover:border-brand-300/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto sm:px-6"
            >
              Start a Conversation
            </a>
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Core Stack</p>
            <ul aria-label="Core skills" className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {siteConfig.skills.map((skill) => (
                <li
                  key={skill}
                  className="shrink-0 rounded-full border border-border bg-slate-900/65 px-3 py-1 text-xs font-medium text-slate-200"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {snapshotCards.map((snapshot) => (
              <article
                key={snapshot.title}
                className="rounded-2xl border border-border bg-slate-900/65 px-4 py-3 backdrop-blur"
              >
                <p className="text-sm font-semibold text-slate-100">{snapshot.title}</p>
                <p className="mt-1 text-xs text-slate-300">{snapshot.impact}</p>
              </article>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Visit GitHub profile"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-slate-900/65 px-3.5 py-2 text-sm text-slate-200 transition duration-200 hover:border-brand-300/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Visit LinkedIn profile"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-slate-900/65 px-3.5 py-2 text-sm text-slate-200 transition duration-200 hover:border-brand-300/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              aria-label="Send email"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-slate-900/65 px-3.5 py-2 text-sm text-slate-200 transition duration-200 hover:border-brand-300/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-slate-900/65 px-3 py-2 text-xs text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-brand-300" />
              {siteConfig.location}
            </span>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {strengthPoints.map((point) => (
              <article
                key={point.title}
                className="rounded-2xl border border-border bg-slate-950/70 px-3 py-3"
              >
                <point.icon className="h-4 w-4 text-brand-300" />
                <h2 className="mt-2 text-sm font-semibold text-slate-100">{point.title}</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{point.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
