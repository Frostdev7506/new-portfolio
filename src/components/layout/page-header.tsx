"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronRight, House } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [, segment, detail] = usePathname().split("/");
  const name = pageNames[segment];
  const isArticle = segment === "blog" && Boolean(detail);

  return (
    <header className="page-header">
      <nav className="header-breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link
              href="/"
              className="breadcrumb-home"
              aria-label="Home"
              aria-current={!segment ? "page" : undefined}
            >
              <House size={18} strokeWidth={1.75} aria-hidden="true" />
              <span>Home</span>
            </Link>
          </li>
          {name && (
            <li>
              <ChevronRight
                className="breadcrumb-divider"
                size={14}
                aria-hidden="true"
              />
              {isArticle ? (
                <Link href="/blog">{name}</Link>
              ) : (
                <span
                  className="breadcrumb-current"
                  aria-current="page"
                  title={name}
                >
                  {name}
                </span>
              )}
            </li>
          )}
          {isArticle && (
            <li>
              <ChevronRight
                className="breadcrumb-divider"
                size={14}
                aria-hidden="true"
              />
              <span className="breadcrumb-current" aria-current="page">
                Article
              </span>
            </li>
          )}
        </ol>
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        <Button asChild variant="ghost" className="resume-link">
          <a
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Résumé
            <ArrowUpRight
              className="size-4"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </a>
        </Button>
      </div>
    </header>
  );
}
