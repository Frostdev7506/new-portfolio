import Image from "next/image";
import { Newsreader } from "next/font/google";
import type { PostSummary } from "@/lib/post-content";
import { formatDate } from "@/lib/utils";
import { TextLink } from "@/components/shared/text-link";

const editorialFont = Newsreader({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export function FeaturedArticle({
  post,
  summary = post.description,
}: {
  post: PostSummary;
  summary?: string;
}) {
  return (
    <article className="featured-article blog-feature">
      <div className="feature-copy">
        <h2 className={editorialFont.className}>{post.title}</h2>
        <p className="feature-description">{summary}</p>
        <p className="post-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readtime}</span>
        </p>
        <div className="feature-links">
          <TextLink href={`/blog/${post.slug}`}>Read article</TextLink>
        </div>
      </div>
      <div className="feature-art-panel">
        <Image
          src={post.cover}
          alt=""
          width={1536}
          height={1024}
          className="feature-art"
          sizes="(max-width: 650px) 100vw, (max-width: 900px) 50vw, 600px"
          priority
        />
      </div>
    </article>
  );
}
