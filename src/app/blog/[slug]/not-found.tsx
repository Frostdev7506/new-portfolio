import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post not found",
  description: "The requested blog article could not be found.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlogPostNotFound() {
  return (
    <section className="rounded-3xl border border-border bg-white px-6 py-14 text-center shadow-sm dark:bg-slate-900">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Post not found</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        The article you requested is not available.
      </p>
      <Link
        href="/blog"
        className="mt-6 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        Back to Blog
      </Link>
    </section>
  );
}
