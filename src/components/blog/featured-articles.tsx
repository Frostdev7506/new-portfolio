"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PostSummary } from "@/lib/post-content";
import { FeaturedArticle } from "./featured-article";

export function FeaturedArticles({ posts }: { posts: PostSummary[] }) {
  const trackRef = useRef<HTMLOListElement>(null);
  const [visible, setVisible] = useState({
    measured: false,
    first: 0,
    last: Math.min(2, posts.length - 1),
    atStart: true,
    atEnd: posts.length <= 3,
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const card = track.firstElementChild;
      if (!card) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const step = card.getBoundingClientRect().width + gap;
      const count = Math.max(1, Math.floor((track.clientWidth + gap + 1) / step));
      const first = Math.round(track.scrollLeft / step);
      const next = {
        measured: true,
        first,
        last: Math.min(posts.length - 1, first + count - 1),
        atStart: track.scrollLeft <= 1,
        atEnd: track.scrollLeft >= track.scrollWidth - track.clientWidth - 1,
      };
      setVisible((current) =>
        current.measured && current.first === next.first && current.last === next.last &&
        current.atStart === next.atStart && current.atEnd === next.atEnd
          ? current
          : next,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    track.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", measure);
    };
  }, [posts.length]);

  const move = (direction: number) => {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!track || !card) return;
    if ((direction < 0 && visible.atStart) || (direction > 0 && visible.atEnd)) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  if (!posts.length) return null;

  return (
    <section className="featured-carousel" aria-labelledby="featured-title" aria-roledescription="carousel">
      <div className="featured-carousel-heading">
        <h2 id="featured-title">Featured</h2>
        {posts.length > 1 && (
          <div className="featured-carousel-controls">
            <p className="featured-position-count" role="status" aria-atomic="true">
              <span className="sr-only">Showing featured articles </span>
              {visible.first + 1}{visible.last > visible.first && `–${visible.last + 1}`}
              <span className="featured-count-divider"> / </span>
              {posts.length}
            </p>
            <div className="featured-arrow-buttons">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Previous featured articles"
                aria-controls="featured-articles-track"
                aria-disabled={visible.atStart}
                onClick={() => move(-1)}
              >
                <ArrowLeft aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Next featured articles"
                aria-controls="featured-articles-track"
                aria-disabled={visible.atEnd}
                onClick={() => move(1)}
              >
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <ol id="featured-articles-track" className="featured-articles-track" ref={trackRef}>
        {posts.map((post, position) => (
          <li key={post.slug}>
            <FeaturedArticle
              post={post}
              priority={position === 0}
              position={position + 1}
              total={posts.length}
              hidden={visible.measured && (position < visible.first || position > visible.last)}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
