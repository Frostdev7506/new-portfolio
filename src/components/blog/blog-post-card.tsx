import Link from "next/link";
import type { BlogPost } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900">
      <Link href={`/blog/${post.slug}`} className="group">
        <h2 className="text-2xl font-semibold text-slate-900 transition group-hover:text-brand-700 dark:text-slate-100 dark:group-hover:text-brand-300">
          {post.title}
        </h2>
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span>{formatDate(post.date)}</span>
        <span>•</span>
        <span>{post.readtime}</span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{post.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={`${post.slug}-${tag}`}
            className="rounded-full border border-border px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
