import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/post-content";
import { formatDate } from "@/lib/utils";
import { TextLink } from "@/components/shared/text-link";

export function FeaturedArticle({ post }: { post: PostSummary }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="featured-article blog-feature">
      <div className="feature-copy">
        <p className="eyebrow">Start here · Featured article</p>
        <h2>
          <Link href={href}>{post.title}</Link>
        </h2>
        <p className="feature-description">{post.description}</p>
        <p className="post-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readtime}</span>
        </p>
        <div className="feature-links">
          <TextLink href={href}>Read article</TextLink>
        </div>
      </div>
      <Link
        href={href}
        className="feature-art-link"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={post.cover}
          alt=""
          width={1536}
          height={1024}
          className="feature-art"
          sizes="(max-width: 900px) 100vw, 480px"
          priority
        />
      </Link>
    </article>
  );
}
