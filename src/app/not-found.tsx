import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The requested page could not be found.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <section className="rounded-3xl border border-border bg-white px-6 py-14 text-center shadow-sm dark:bg-slate-900">
      <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-100">Page not found</h1>
      <p className="mx-auto mt-3 max-w-lg text-slate-600 dark:text-slate-300">
        The page you requested does not exist or has been moved.
      </p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white">
        Return Home
      </Link>
    </section>
  );
}
