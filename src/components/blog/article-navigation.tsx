"use client";

import { useEffect, useState } from "react";
import { ArrowUp, List } from "lucide-react";
import type { ArticleHeading } from "@/lib/article-content";

export function ArticleNavigation({
  headings,
}: {
  headings: ArticleHeading[];
}) {
  const [active, setActive] = useState(headings[0]?.id);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const article = document.getElementById("article-content");
      if (!article) return;
      const bounds = article.getBoundingClientRect();
      const distance = Math.max(1, article.offsetHeight - window.innerHeight);
      setProgress(Math.max(0, Math.min(100, (-bounds.top / distance) * 100)));
      let current = headings[0]?.id;
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= 140)
          current = heading.id;
      }
      setActive(current);
      frame = 0;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [headings]);
  const links = (
    <ol>
      {headings.map((heading) => (
        <li
          key={heading.id}
          className={heading.depth === 3 ? "toc-nested" : ""}
        >
          <a
            href={`#${heading.id}`}
            aria-current={active === heading.id ? "location" : undefined}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      <div className="reading-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <aside className="article-navigation" aria-label="Article navigation">
        <nav className="desktop-toc" aria-label="On this page">
          <p className="toc-title">On this page</p>
          {links}
          <a className="toc-back" href="#article-top">
            <ArrowUp aria-hidden="true" /> Back to top
          </a>
        </nav>
        <details className="mobile-toc">
          <summary>
            <List aria-hidden="true" /> On this page
          </summary>
          <nav aria-label="On this page">{links}</nav>
        </details>
      </aside>
    </>
  );
}
