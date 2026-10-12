import { siteConfig } from "@/data/site";
import { getAllPosts, toPostSummary } from "@/lib/posts";
import { buildRss } from "@/lib/rss";

export const dynamic = "force-static";

export async function GET() {
  return new Response(
    buildRss((await getAllPosts()).map(toPostSummary), siteConfig),
    {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
