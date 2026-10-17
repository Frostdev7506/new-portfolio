import { AboutIntro } from "@/components/about/about-intro";
import { Experience } from "@/components/about/experience";
import { Toolkit } from "@/components/about/toolkit";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageIntro } from "@/components/shared/page-intro";
import { TextLink } from "@/components/shared/text-link";
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
    <div className="about-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(profilePageJsonLd()) }}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />
      <PageIntro title="About me" />
      <AboutIntro />
      <Experience detailed />
      <Toolkit />
      <section className="section-block education">
        <div className="education-grid">
          <div>
            <div>
              <h2>Education</h2>
              <p>{education.degree}</p>
              <p>{education.institution}</p>
            </div>
          </div>
          <div>
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
      <section className="about-closing" aria-labelledby="about-contact-title">
        <h2 id="about-contact-title">Let’s build something useful.</h2>
        <TextLink href="/contact">Get in touch</TextLink>
      </section>
    </div>
  );
}
