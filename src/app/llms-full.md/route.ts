import { buildFullAgentContent } from "@/lib/agent-content";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

export async function GET() {
  return new Response(buildFullAgentContent(await getAllPosts()), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Link: '</llms.txt>; rel="describedby"',
    },
  });
}
