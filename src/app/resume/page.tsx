import { ResumeViewer } from "@/components/resume/resume-viewer";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageIntro } from "@/components/shared/page-intro";
import { TextLink } from "@/components/shared/text-link";
import { siteConfig } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Résumé",
  description:
    "Neeraj Butola’s full-stack and cloud engineering experience, projects, and skills.",
  path: "/resume",
});

export default function ResumePage() {
  return (
    <div className="resume-page">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Résumé", href: "/resume" },
        ]}
      />
      <PageIntro
        title="Résumé"
        description="My professional experience, projects, and skills."
      />
      <TextLink href={siteConfig.resumeUrl} external className="resume-download">
        Download PDF
      </TextLink>
      <div className="resume-document">
        <ResumeViewer />
      </div>
    </div>
  );
}
