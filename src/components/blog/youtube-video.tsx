"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function YouTubeVideo({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  const player = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (playing) player.current?.focus();
  }, [playing]);

  return (
    <figure className="article-video">
      <div className="article-video-frame">
        {playing ? (
          <iframe
            ref={player}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`}
            title={`${title} — YouTube video`}
            referrerPolicy="strict-origin-when-cross-origin"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            tabIndex={0}
          />
        ) : (
          <Button
            type="button"
            variant="ghost"
            className="article-video-play"
            aria-label={`Play ${title}`}
            onClick={() => setPlaying(true)}
          >
            <Image
              src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
              alt=""
              fill
              // The wide YouTube source is cropped to portrait; keep its center sharp.
              sizes="1140px"
              className="article-video-thumbnail"
              priority
            />
            <span className="article-video-play-label">
              <Play aria-hidden="true" /> Play video
            </span>
          </Button>
        )}
      </div>
      <figcaption>
        <a
          href={`https://www.youtube.com/shorts/${videoId}`}
          target="_blank"
          rel="noopener"
        >
          Watch on YouTube <ArrowUpRight aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}
