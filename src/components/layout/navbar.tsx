"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  FileText,
  Folder,
  Github,
  Linkedin,
  Mail,
  Pencil,
  UserRound,
} from "lucide-react";
import { siteConfig } from "@/data/site";
import { notebook } from "@/data/notebook";

const icons = {
  Blog: Pencil,
  Projects: Folder,
  About: UserRound,
  Contact: Mail,
};

export function Navbar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/" className="identity" aria-label="Neeraj Butola — home">
        <Image
          src="/illustrations/brand.png"
          alt=""
          width={384}
          height={256}
          className="brand-art"
          priority
        />
        <span className="identity-name">{siteConfig.name}</span>
      </Link>
      <p className="identity-role">{notebook.tagline}</p>
      <p className="identity-description">{siteConfig.longDescription}</p>
      <nav className="primary-nav" aria-label="Primary">
        {siteConfig.nav.map(({ label, href }) => {
          const Icon = icons[label as keyof typeof icons];
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              href={href}
              key={href}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={22} strokeWidth={1.65} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
      <nav className="social-nav" aria-label="Elsewhere">
        <a
          href={siteConfig.social.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={22} strokeWidth={1.65} aria-hidden="true" />
          GitHub
        </a>
        <a
          href={siteConfig.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin size={22} strokeWidth={1.65} aria-hidden="true" />
          LinkedIn
        </a>
        <Link href="/resume">
          <FileText size={22} strokeWidth={1.65} aria-hidden="true" />
          View résumé <ArrowUpRight size={20} strokeWidth={1.65} aria-hidden="true" />
        </Link>
      </nav>
    </aside>
  );
}
