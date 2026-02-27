import { Metadata } from "next";
import { AspirationsSection } from "@/components/home/aspirations-section";
import { AchievementsSection } from "@/components/home/achievements-section";
import { ContactSection } from "@/components/home/contact-section";
import { GitHubWidget } from "@/components/home/github-widget";
import { HeroSection } from "@/components/home/hero-section";
import { PortfolioSection } from "@/components/home/portfolio-section";
import { ResumeSection } from "@/components/home/resume-section";
import { TechStackSection } from "@/components/home/tech-stack-section";
import { siteConfig } from "@/data/site";
import { getGitHubRepos } from "@/lib/github";
import { buildPageMetadata, fullUrl } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `${siteConfig.name} | ${siteConfig.role}`,
  description: siteConfig.description,
  path: "/",
  keywords: [
    "developer portfolio",
    "full-stack engineer portfolio",
    "MERN cloud engineer",
    "software projects",
  ],
});

export default async function Home() {
  const repos = await getGitHubRepos();
  const homePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${siteConfig.name} Portfolio`,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    mainEntity: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
      jobTitle: siteConfig.role,
    },
    primaryImageOfPage: fullUrl(siteConfig.image),
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd) }}
      />

      <div className="space-y-16 md:space-y-20">
        <HeroSection />
        <PortfolioSection />
        <GitHubWidget repos={repos} />
        <TechStackSection />
        <AchievementsSection />
        <AspirationsSection />
        <ResumeSection />
        <ContactSection />
      </div>
    </>
  );
}
