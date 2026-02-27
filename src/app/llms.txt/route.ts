import { siteConfig } from "@/data/site";

export async function GET() {
  const body = [
    `# ${siteConfig.shortName}`,
    "",
    `Site: ${siteConfig.url}`,
    "",
    "## Summary",
    "Portfolio and technical blog for Neeraj Butola, focused on full-stack engineering and cloud systems.",
    "",
    "## Primary Pages",
    `${siteConfig.url}/`,
    `${siteConfig.url}/blog`,
    "",
    "## Contact",
    `mailto:${siteConfig.email}`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
