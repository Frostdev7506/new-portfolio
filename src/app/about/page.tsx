import { FileText, GraduationCap } from "lucide-react";
import { AboutIntro } from "@/components/about/about-intro";
import { Experience } from "@/components/about/experience";
import { Toolkit } from "@/components/about/toolkit";
import { ContactBanner } from "@/components/shared/contact-banner";
import { PageIntro } from "@/components/shared/page-intro";
import { education, certifications } from "@/data/notebook";
import { buildPageMetadata, profilePageJsonLd, serializeJsonLd } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "About",
  description:
    "I’m Neeraj Butola, a full-stack developer building web applications, APIs, and cloud systems.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(profilePageJsonLd()) }}
      />
      <PageIntro title="About me" />
      <AboutIntro />
      <Experience detailed />
      <Toolkit />
      <section className="section-block education">
        <div className="education-grid">
          <div>
            <GraduationCap size={36} strokeWidth={1.4} aria-hidden="true" />
            <div>
              <h2>Education</h2>
              <p>{education.degree}</p>
              <p>{education.institution}</p>
            </div>
          </div>
          <div>
            <FileText size={34} strokeWidth={1.4} aria-hidden="true" />
            <div>
              <h2>Certifications</h2>
              <ul>
                {certifications.map((certification) => (
                  <li key={certification}>{certification}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
