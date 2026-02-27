import Link from "next/link";
import { Download } from "lucide-react";
import { siteConfig } from "@/data/site";

export function Navbar() {
  return (
    <header className="sticky top-3 z-50 px-3 sm:px-4">
      <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-100 sm:text-base">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[color:var(--accent)] text-xs font-bold text-white">
              NB
            </span>
            {siteConfig.shortName}
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 rounded-full border border-border bg-slate-900/70 p-1 md:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-sm text-slate-300 transition duration-200 hover:border-slate-700/80 hover:bg-slate-800/80 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={siteConfig.resumeUrl}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[color:var(--accent)] px-3.5 py-2 text-xs font-medium text-white transition duration-200 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:px-4 sm:text-sm"
            >
              <Download className="h-4 w-4" />
              Resume
            </a>
          </div>
        </div>

        <nav aria-label="Mobile" className="border-t border-border px-4 py-2 md:hidden">
          <div className="no-scrollbar mx-auto flex w-full max-w-6xl items-center gap-2 overflow-x-auto">
            {siteConfig.nav.map((item) => (
              <Link
                key={`${item.label}-mobile`}
                href={item.href}
                className="shrink-0 rounded-full border border-border bg-slate-900/80 px-3 py-1.5 text-sm text-slate-300 transition duration-200 hover:border-brand-300/70 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
