import { siteConfig } from "@/data/site";

type GitHubRepoApi = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  languages_url: string;
  fork: boolean;
  archived: boolean;
};

export type PublicRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  languages: string[];
};

async function githubFetch<T>(url: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getGitHubRepos(): Promise<PublicRepo[]> {
  try {
    const repos = await githubFetch<GitHubRepoApi[]>(
      `https://api.github.com/users/${siteConfig.githubUsername}/repos?sort=updated&per_page=30`,
    );

    const curated = repos.filter((repo) => !repo.fork && !repo.archived).slice(0, 18);

    const withLanguages = await Promise.all(
      curated.map(async (repo) => {
        try {
          const languages = await githubFetch<Record<string, number>>(repo.languages_url);

          return {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            languages: Object.keys(languages).slice(0, 6),
          };
        } catch {
          return {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            languages: [],
          };
        }
      }),
    );

    return withLanguages;
  } catch {
    return [];
  }
}
