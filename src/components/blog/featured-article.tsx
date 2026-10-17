import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/post-content";
import { formatDate } from "@/lib/utils";

export function FeaturedArticle({
  post,
  priority = false,
  position,
  total,
  hidden,
}: {
  post: PostSummary;
  priority?: boolean;
  position: number;
  total: number;
  hidden: boolean;
}) {
  const titleId = `featured-${post.slug}-title`;
  return (
    <article
      className="featured-article"
      role="group"
      aria-roledescription="slide"
      aria-label={`${position} of ${total}`}
      aria-hidden={hidden}
      inert={hidden}
    >
      <Link className="featured-story-link" href={`/blog/${post.slug}`} aria-labelledby={titleId}>
        <div className="feature-art-panel">
          <Image
            src={post.cover}
            alt={post.coverAlt}
            width={post.coverWidth ?? 1536}
            height={post.coverHeight ?? 1024}
            className="feature-art"
            sizes="(max-width: 600px) 80vw, (max-width: 1000px) 44vw, 400px"
            loading={position <= 3 ? "eager" : "lazy"}
            priority={priority}
          />
        </div>
        <p className="feature-category">{post.category}</p>
        <h3 id={titleId}>{post.title}</h3>
        <p className="post-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readtime}</span>
        </p>
      </Link>
    </article>
  );
}
