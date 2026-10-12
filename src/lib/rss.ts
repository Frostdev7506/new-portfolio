import type { PostSummary } from "./post-content.ts";

export function escapeXml(value: string) {
  return value.replace(
    /[<>&"']/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[character]!,
  );
}

export function buildRss(
  posts: PostSummary[],
  site: { url: string; name: string; description: string },
) {
  const url = site.url.replace(/\/$/, "");
  const published = posts.filter((post) => !post.draft);
  const lastUpdated = published
    .map((post) => post.updated)
    .sort()
    .at(-1);
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${escapeXml(site.name)} — The notebook</title><link>${escapeXml(url)}/blog</link>
<description>${escapeXml(site.description)}</description><language>en</language>
<atom:link href="${escapeXml(url)}/feed.xml" rel="self" type="application/rss+xml"/>
${lastUpdated ? `<lastBuildDate>${new Date(lastUpdated).toUTCString()}</lastBuildDate>` : ""}
${published.map((post) => `<item><title>${escapeXml(post.title)}</title><link>${escapeXml(url)}/blog/${post.slug}</link><guid isPermaLink="true">${escapeXml(url)}/blog/${post.slug}</guid><description>${escapeXml(post.description)}</description><pubDate>${new Date(post.date).toUTCString()}</pubDate><category>${escapeXml(post.category)}</category></item>`).join("\n")}
</channel></rss>`;
}
