"use client";

import { useMemo, useState } from "react";
import { SectionHeading } from "@/components/shared/section-heading";
import { SnapCarousel } from "@/components/shared/snap-carousel";
import { siteConfig } from "@/data/site";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  languages: string[];
};

const maxVisibleRepos = 12;

export function GitHubWidget({ repos }: { repos: Repo[] }) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const technologies = useMemo(() => {
    const set = new Set<string>();
    repos.forEach((repo) => repo.languages.forEach((language) => set.add(language)));
    return Array.from(set).sort();
  }, [repos]);

  const filteredRepos = useMemo(() => {
    if (!selectedTech) {
      return repos;
    }

    return repos.filter((repo) => repo.languages.includes(selectedTech));
  }, [repos, selectedTech]);

  const visibleRepos = useMemo(
    () => filteredRepos.slice(0, maxVisibleRepos),
    [filteredRepos],
  );

  const updateTechFilter = (tech: string) => {
    setSelectedTech((prev) => (prev === tech ? null : tech));
  };

  return (
    <section id="open-source" className="space-y-8">
      <SectionHeading
        label="Open Source"
        title="Code Portfolio on GitHub"
        description="Filter and skim recent repos."
      />

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {technologies.map((tech) => (
          <button
            key={tech}
            type="button"
            onClick={() => updateTechFilter(tech)}
            className={`shrink-0 cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:text-sm ${
              selectedTech === tech
                ? "border-brand-300 bg-brand-300/20 text-white"
                : "border-border bg-slate-950/80 text-slate-300 hover:border-brand-300/70 hover:text-white"
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      {visibleRepos.length ? (
        <div className="rounded-3xl border border-border bg-[linear-gradient(145deg,rgba(56,189,248,0.14),rgba(15,23,42,0.92),rgba(15,23,42,0.95))] px-3 py-4 sm:px-4 sm:py-5">
          <SnapCarousel
            ariaLabel="github repositories"
            itemClassName="w-[88%] shrink-0 snap-start sm:w-[56%] lg:w-[42%] xl:w-[33%]"
            autoScroll
          >
            {visibleRepos.map((repo, index) => (
              <article
                key={repo.id}
                className="h-full rounded-2xl border border-border bg-slate-950/85 p-5 shadow-[0_20px_50px_-42px_rgba(34,211,238,0.8)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-slate-100">{repo.name}</h3>
                  <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-clip-2 mt-2 text-sm leading-relaxed text-slate-300">
                  {repo.description || "View this repository for implementation details and source code."}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(repo.languages.length ? repo.languages : ["GitHub"]).slice(0, 3).map((language) => (
                    <span
                      key={`${repo.id}-${language}`}
                      className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300"
                    >
                      {language}
                    </span>
                  ))}
                </div>

                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-flex cursor-pointer rounded-full border border-border bg-slate-900/75 px-4 py-2 text-sm font-medium text-slate-100 transition duration-200 hover:border-brand-300/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  View on GitHub
                </a>
              </article>
            ))}
          </SnapCarousel>
        </div>
      ) : (
        <p className="rounded-2xl border border-border bg-slate-950/80 px-4 py-4 text-sm text-slate-300">
          No repositories found for this filter. Try another language.
        </p>
      )}

      <p className="text-center text-xs text-slate-400">
        Showing {visibleRepos.length} of {Math.min(filteredRepos.length, maxVisibleRepos)} filtered repos.
        <a
          href={siteConfig.social.github}
          target="_blank"
          rel="noreferrer noopener"
          className="ml-1.5 cursor-pointer font-medium text-brand-300 underline underline-offset-2"
        >
          View full profile
        </a>
      </p>
    </section>
  );
}
