"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

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
  const [, segment, child] = usePathname().split("/");
  const name = pageNames[segment];

  if (!name) return null;

  return (
    <nav className="site-breadcrumb" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      <ChevronRight size={14} aria-hidden="true" />
      {child ? (
        <Link href={`/${segment}`}>{name}</Link>
      ) : (
        <span aria-current="page">{name}</span>
      )}
    </nav>
  );
}
