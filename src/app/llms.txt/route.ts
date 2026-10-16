import { buildAgentIndex } from "@/lib/agent-content";
import { getAllPosts, toPostSummary } from "@/lib/posts";

export const dynamic = "force-static";

export async function GET() {
  return new Response(buildAgentIndex((await getAllPosts()).map(toPostSummary)), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Link: '</llms.txt>; rel="describedby"',
    },
  });
}
