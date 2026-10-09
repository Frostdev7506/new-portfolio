"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { siteConfig } from "@/data/site";

const pageNames: Record<string, string> = {
  blog: "Blog",
  projects: "Projects",
  about: "About",
  contact: "Contact",
  resume: "Résumé",
  privacy: "Privacy",
  "editorial-policy": "Editorial policy",
};

export function PageHeader() {
  const segment = usePathname().split("/")[1];
  const name = pageNames[segment];

  return (
    <header className="page-header mono">
      <nav aria-label="Breadcrumb">
        <Link href="/">Notebook</Link>
        {name && (
          <>
            <span className="breadcrumb-divider" aria-hidden="true">
              /
            </span>
            <span aria-current="page">{name}</span>
          </>
        )}
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        <a
          href={siteConfig.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="resume-link"
        >
          Résumé <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
