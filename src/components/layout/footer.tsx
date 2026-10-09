import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { siteConfig } from "@/data/site";

const socialLinks = [
  { label: "GitHub", href: siteConfig.social.github, icon: Github },
  { label: "LinkedIn", href: siteConfig.social.linkedin, icon: Linkedin },
  { label: "Twitter", href: siteConfig.social.twitter, icon: Twitter },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-8 px-4 sm:px-6 md:flex-row">
        <div>
          <p className="text-base font-semibold">{siteConfig.shortName}</p>
          <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
            Full-stack portfolio focused on engineering outcomes, speed, and clear product value.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/75 text-slate-600 transition hover:-translate-y-0.5 hover:text-slate-900 dark:bg-slate-900/75 dark:text-slate-300 dark:hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
            <Link href="/">Home</Link>
            <Link href="/blog">Blog</Link>
            <a href="#contact">Contact</a>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
