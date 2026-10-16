import { buildArticleMarkdown } from "@/lib/agent-content";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { resolveBlogSeo } from "@/lib/blog-seo";
import { siteConfig } from "@/data/site";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const post = await getPostBySlug((await params).slug);
  if (!post) {
    return new Response("Article not found.\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const seo = resolveBlogSeo(post, siteConfig);
  return new Response(buildArticleMarkdown(post), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Link: `<${seo.canonicalUrl}>; rel="canonical", </llms.txt>; rel="describedby"`,
      "X-Robots-Tag": seo.robotsContent,
    },
  });
}
