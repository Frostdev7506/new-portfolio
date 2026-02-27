import { FileText } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { siteConfig } from "@/data/site";

export function ResumeSection() {
  const resumeFileUrl = siteConfig.resumeUrl.startsWith("http")
    ? siteConfig.resumeUrl
    : `${siteConfig.url}${siteConfig.resumeUrl}`;

  const googleViewerUrl =
    "https://drive.google.com/viewerng/viewer?embedded=true&url=" +
    encodeURIComponent(resumeFileUrl);

  return (
    <section className="space-y-10">
      <SectionHeading
        label="Resume"
        title="Full CV"
        description="Preview the resume inline or download the latest PDF directly."
      />

      <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm dark:bg-slate-900">
        <header className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Resume Preview</h3>
          </div>
          <a
            href={resumeFileUrl}
            className="inline-flex w-fit rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Download PDF
          </a>
        </header>

        <div className="h-[65vh] min-h-[420px] w-full bg-slate-50 dark:bg-slate-950">
          <iframe
            src={googleViewerUrl}
            title="Neeraj Butola Resume"
            className="h-full w-full"
            loading="lazy"
          />
        </div>
      </article>
    </section>
  );
}
