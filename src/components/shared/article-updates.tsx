import { ArrowUpRight, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import { articleUpdates } from "@/data/notebook";
import { siteConfig } from "@/data/site";

export function ArticleUpdates() {
  const { newsletterUrl } = siteConfig;

  return (
    <section
      id="updates"
      className="section-block article-updates"
      aria-labelledby="updates-title"
    >
      <div>
        <h2 id="updates-title">
          {newsletterUrl ? articleUpdates.title : articleUpdates.feedTitle}
        </h2>
        <p className="updates-description">
          {newsletterUrl
            ? articleUpdates.description
            : articleUpdates.feedDescription}
        </p>
      </div>
      <div className="updates-actions">
        {newsletterUrl && (
          <Button asChild size="lg" className="primary-button">
            <a href={newsletterUrl}>
              Subscribe by email <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
        )}
        <a href="/feed.xml" className="text-link">
          <Rss size={18} aria-hidden="true" /> Subscribe via RSS
        </a>
      </div>
    </section>
  );
}
