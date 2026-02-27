import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Editorial Policy",
  description:
    "Editorial standards for technical articles published on Neeraj Butola's engineering blog.",
  path: "/editorial-policy",
  keywords: ["editorial policy", "engineering content standards", "technical writing process"],
});

export default function EditorialPolicyPage() {
  return (
    <section className="space-y-6 rounded-3xl border border-border bg-slate-950/80 p-6 text-slate-200 shadow-sm md:p-8">
      <h1 className="text-3xl font-semibold text-slate-100">Editorial Policy</h1>
      <p className="leading-relaxed text-slate-300">
        Articles on this site are based on practical engineering work, implementation experience, and production lessons from full-stack and cloud projects.
      </p>
      <p className="leading-relaxed text-slate-300">
        Content is written to prioritize clarity, technical accuracy, and actionable guidance. Posts are updated when architecture decisions, tooling practices, or recommended approaches evolve.
      </p>
      <p className="leading-relaxed text-slate-300">
        Where appropriate, references to official documentation or external technical resources are included to support claims and enable deeper validation.
      </p>
    </section>
  );
}
