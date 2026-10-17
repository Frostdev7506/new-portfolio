"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { siteConfig } from "@/data/site";

const homeSections: Record<string, string> = {
  "/projects": "#portfolio",
  "/about": "#about",
  "/contact": "#contact",
};

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="site-masthead site-container">
      <Link href="/" className="site-identity" aria-label={`${siteConfig.name} — home`}>
        <svg className="site-monogram" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M7 10h11l17 21V12h-5v-2h13v2h-5v27h-3L15 15v21h5v2H7v-2h5V12H7z" />
        </svg>
      </Link>
      <nav className="site-navigation" aria-label="Primary">
        {siteConfig.nav.map(({ label, href }) => (
          <Link
            key={href}
            href={isHome && homeSections[href] ? homeSections[href] : href}
            aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="site-header-actions">
        <Link href="/resume" className="site-resume" aria-current={pathname === "/resume" ? "page" : undefined}>
          Résumé <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
