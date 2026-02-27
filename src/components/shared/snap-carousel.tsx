"use client";

import {
  Children,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SnapCarouselProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  itemClassName?: string;
  controlsAlign?: "start" | "end";
};

const defaultTrackClassName =
  "-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
const defaultItemClassName = "w-[86%] shrink-0 snap-start sm:w-[57%] lg:w-[38%]";

export function SnapCarousel({
  ariaLabel,
  children,
  className = "",
  trackClassName = "",
  itemClassName = defaultItemClassName,
  controlsAlign = "end",
}: SnapCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const items = useMemo(() => Children.toArray(children), [children]);

  const syncScrollState = useCallback(() => {
    const node = containerRef.current;

    if (!node) {
      return;
    }

    const nextCanScrollPrev = node.scrollLeft > 6;
    const nextCanScrollNext = node.scrollLeft + node.clientWidth < node.scrollWidth - 6;

    setCanScrollPrev((prev) => (prev === nextCanScrollPrev ? prev : nextCanScrollPrev));
    setCanScrollNext((prev) => (prev === nextCanScrollNext ? prev : nextCanScrollNext));
  }, []);

  useEffect(() => {
    const node = containerRef.current;

    if (!node) {
      return;
    }

    const scheduleSync = () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        syncScrollState();
      });
    };

    scheduleSync();
    node.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);

    return () => {
      node.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [syncScrollState]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => setReducedMotion(mediaQuery.matches);

    updateReducedMotion();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateReducedMotion);
      return () => mediaQuery.removeEventListener("change", updateReducedMotion);
    }

    mediaQuery.addListener(updateReducedMotion);
    return () => mediaQuery.removeListener(updateReducedMotion);
  }, []);

  const scrollByPage = (direction: -1 | 1) => {
    const node = containerRef.current;

    if (!node) {
      return;
    }

    node.scrollBy({
      left: direction * Math.max(280, node.clientWidth * 0.9),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className={className}>
      <div className={`mb-4 flex ${controlsAlign === "start" ? "justify-start" : "justify-end"} gap-2`}>
        <button
          type="button"
          aria-label={`Scroll ${ariaLabel} left`}
          onClick={() => scrollByPage(-1)}
          disabled={!canScrollPrev}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-slate-950/80 text-slate-200 transition duration-200 hover:border-brand-300/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label={`Scroll ${ariaLabel} right`}
          onClick={() => scrollByPage(1)}
          disabled={!canScrollNext}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-slate-950/80 text-slate-200 transition duration-200 hover:border-brand-300/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div ref={containerRef} aria-label={ariaLabel} className={`${defaultTrackClassName} ${trackClassName}`}>
        {items.map((item, index) => (
          <div key={index} className={itemClassName}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
