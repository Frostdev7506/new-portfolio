"use client";

import { useMemo, useState } from "react";
import { siteConfig } from "@/data/site";
import { ArrowUpRight, Github } from "lucide-react";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  languages: string[];
};

const maxVisibleRepos = 6;

export function GitHubWidget({ repos }: { repos: Repo[] }) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const technologies = useMemo(() => {
    const set = new Set<string>();
    repos.forEach((repo) => repo.languages.forEach((language) => set.add(language)));
    return Array.from(set).sort();
  }, [repos]);

  const filteredRepos = useMemo(() => {
    if (!selectedTech) return repos;
    return repos.filter((repo) => repo.languages.includes(selectedTech));
  }, [repos, selectedTech]);

  const visibleRepos = useMemo(
    () => filteredRepos.slice(0, maxVisibleRepos),
    [filteredRepos],
  );

  return (
    <section id="open-source" className="py-24 lg:py-32 border-b border-border/40">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h2 className="text-4xl font-black tracking-tighter sm:text-5xl uppercase mb-4">Open Source</h2>
          <p className="text-muted-foreground max-w-md font-light tracking-wide leading-relaxed">
            A curated selection of my public repositories and contributions.
          </p>
        </div>
        <div className="hidden md:block text-xs uppercase tracking-[0.3em] font-medium text-muted-foreground/40 text-right">
          02 // GitHub
        </div>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-4 mb-16">
        <button
          onClick={() => setSelectedTech(null)}
          className={`text-[10px] tracking-[0.2em] font-bold uppercase transition-all duration-300 pb-2 border-b-2 ${selectedTech === null ? "border-primary text-primary" : "border-transparent text-muted-foreground/60 hover:text-foreground"
            }`}
        >
          All
        </button>
        {technologies.map((tech) => (
          <button
            key={tech}
            onClick={() => setSelectedTech(tech)}
            className={`text-[10px] tracking-[0.2em] font-bold uppercase transition-all duration-300 pb-2 border-b-2 ${selectedTech === tech ? "border-primary text-primary" : "border-transparent text-muted-foreground/60 hover:text-foreground"
              }`}
          >
            {tech}
          </button>
        ))}
      </div>

      <div className="grid gap-px bg-border/40 sm:grid-cols-2 lg:grid-cols-3 border border-border/40">
        {visibleRepos.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="group relative bg-background p-8 focus:outline-none hover:bg-muted/5 transition-all duration-500 flex flex-col justify-between min-h-[300px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <Github className="h-5 w-5 text-muted-foreground/60 group-hover:text-primary transition-colors duration-300" />
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-500" />
              </div>
              <h3 className="text-lg font-bold tracking-tight uppercase mb-4 group-hover:text-primary transition-colors duration-300 line-clamp-1">{repo.name}</h3>
              <p className="text-sm text-muted-foreground/80 font-light leading-relaxed line-clamp-3">
                {repo.description || "Implementation details and source code."}
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap gap-3 mt-10">
              {(repo.languages.length ? repo.languages : ["GitHub"]).slice(0, 3).map((language) => (
                <span
                  key={`${repo.id}-${language}`}
                  className="text-[9px] tracking-[0.2em] uppercase font-mono text-muted-foreground/50 border border-border/50 px-2 py-1 bg-background"
                >
                  {language}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>

      {visibleRepos.length === 0 && (
        <div className="py-32 text-center text-muted-foreground/60 font-mono text-sm tracking-widest uppercase border border-border/40 border-t-0 bg-muted/5">
          No repositories found for this filter.
        </div>
      )}

      <div className="mt-16 text-center">
        <a
          href={siteConfig.social.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground hover:text-primary transition-all duration-300 group"
        >
          View full profile
          <ArrowUpRight className="h-4 w-4 transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
}
