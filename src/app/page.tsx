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
import { personJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.role}`,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const repos = await getGitHubRepos();

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />

      <div className="space-y-16 md:space-y-20">
        <HeroSection />
        <TechStackSection />
        <AspirationsSection />
        <AchievementsSection />
        <PortfolioSection />
        <ResumeSection />
        <GitHubWidget repos={repos} />
        <ContactSection />
      </div>
    </>
  );
}
