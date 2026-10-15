import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Blog Studio",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function BlogStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ article?: string }>;
}) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { BlogStudio } = await import("@/components/blog/editor/blog-studio");
  const { article } = await searchParams;
  return <BlogStudio initialSlug={article} />;
}
