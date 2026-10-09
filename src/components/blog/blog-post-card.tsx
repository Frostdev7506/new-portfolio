import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { postArtwork } from "@/data/notebook";

export function BlogPostCard({ post }: { post: BlogPost }) {
  const artwork = postArtwork[post.slug];
  return (
    <article className="archive-post">
      {artwork && (
        <Link href={"/blog/" + post.slug} tabIndex={-1} aria-hidden="true">
          <Image
            src={artwork.image}
            alt=""
            width={340}
            height={210}
            className="archive-art"
          />
        </Link>
      )}
      <div>
        <h3>
          <Link href={"/blog/" + post.slug}>{post.title}</Link>
        </h3>
        <p>{artwork?.description || post.description}</p>
        <p className="post-meta">
          {formatDate(post.date)}
          <span>·</span>
          {post.readtime}
        </p>
      </div>
      <Link
        className="archive-arrow"
        href={"/blog/" + post.slug}
        aria-label={"Read " + post.title}
      >
        <ArrowRight aria-hidden="true" />
      </Link>
    </article>
  );
}
