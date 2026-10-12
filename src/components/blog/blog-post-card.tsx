import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PostSummary } from "@/lib/post-content";
import { formatDate } from "@/lib/utils";

export function BlogPostCard({ post }: { post: PostSummary }) {
  return (
    <article className="notebook-post">
      <Link
        href={`/blog/${post.slug}`}
        className="post-art-link"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={post.cover}
          alt=""
          width={1536}
          height={1024}
          sizes="(max-width: 600px) 100vw, 240px"
          className="post-art"
        />
      </Link>
      <div className="post-card-copy">
        <p className="eyebrow">{post.category}</p>
        <h3>
          <Link href={`/blog/${post.slug}`}>
            {post.title}
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </h3>
        <p className="post-card-description">{post.description}</p>
        <p className="post-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readtime}</span>
        </p>
      </div>
    </article>
  );
}
