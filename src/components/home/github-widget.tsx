"use client";

import { useMemo, useState } from "react";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  languages: string[];
};

const reposPerPage = 6;

export function GitHubWidget({ repos }: { repos: Repo[] }) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(filteredRepos.length / reposPerPage));
  const currentRepos = filteredRepos.slice(
    (currentPage - 1) * reposPerPage,
    currentPage * reposPerPage,
  );

  const updateTechFilter = (tech: string) => {
    setCurrentPage(1);
    setSelectedTech((prev) => (prev === tech ? null : tech));
  };

  return (
    <section className="space-y-8">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-brand-700 dark:text-brand-300">Open Source</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100 md:text-4xl">
          GitHub Repositories
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
          Current work, experiments, and learning builds from my public GitHub profile.
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-2">
        {technologies.map((tech) => (
          <button
            key={tech}
            type="button"
            onClick={() => updateTechFilter(tech)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition sm:text-sm ${
              selectedTech === tech
                ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                : "border-border bg-white text-slate-600 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {currentRepos.map((repo) => (
          <article
            key={repo.id}
            className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-slate-900"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{repo.name}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {repo.description || "View this repository for implementation details and source code."}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {(repo.languages.length ? repo.languages : ["GitHub"]).map((language) => (
                <span
                  key={`${repo.id}-${language}`}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300"
                >
                  {language}
                </span>
              ))}
            </div>

            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              View on GitHub
            </a>
          </article>
        ))}
      </div>

      {totalPages > 1 ? (
        <nav aria-label="Repository pagination" className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="rounded-full border border-border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`h-10 w-10 rounded-full border text-sm ${
                page === currentPage
                  ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                  : "border-border"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="rounded-full border border-border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      ) : null}
    </section>
  );
}
