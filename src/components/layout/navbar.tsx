import Link from "next/link";
import { Download } from "lucide-react";
import { siteConfig } from "@/data/site";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight sm:text-base">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[color:var(--accent)] text-xs font-bold text-white">
            NB
          </span>
          {siteConfig.shortName}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 rounded-full border border-border bg-white/70 p-1 md:flex dark:bg-slate-900/70">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm text-slate-600 transition hover:bg-[color-mix(in_srgb,var(--brand-100)_65%,transparent)] hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={siteConfig.resumeUrl}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800 sm:px-4 sm:text-sm"
          >
            <Download className="h-4 w-4" />
            Resume
          </a>
        </div>
      </div>

      <nav aria-label="Mobile" className="border-t border-border px-4 py-2 md:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 overflow-x-auto">
          {siteConfig.nav.map((item) => (
            <Link
              key={`${item.label}-mobile`}
              href={item.href}
              className="shrink-0 rounded-full border border-border bg-white/80 px-3 py-1.5 text-sm text-slate-600 transition hover:text-slate-900 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
