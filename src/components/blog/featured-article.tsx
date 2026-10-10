import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { notebook } from "@/data/notebook";
import { TextLink } from "@/components/shared/text-link";

export function FeaturedArticle({ post }: { post: BlogPost }) {
  const href = "/blog/" + post.slug;
  return (
    <article className="featured-article blog-feature">
      <div className="feature-copy">
        <p className="eyebrow">Featured</p>
        <h2>
          <Link href={href}>{post.title}</Link>
        </h2>
        <p className="feature-description">{notebook.featuredDescription}</p>
        <p className="post-meta">
          {formatDate(post.date)}
          <span>·</span>
          {post.readtime}
          <span className="meta-tags">{post.tags.join(" · ")}</span>
        </p>
        <div className="feature-links">
          <TextLink href={href}>Read article</TextLink>
        </div>
      </div>
      <Link
        href={href}
        className="feature-art-link"
        aria-label={"Read " + post.title}
      >
        <Image
          src="/illustrations/web-rendering.png"
          alt="A request travels from a browser to a server, which responds with HTML, CSS, and JavaScript for the browser to render."
          width={1942}
          height={809}
          className="feature-art"
          sizes="(max-width: 600px) 100vw, 480px"
          priority
        />
      </Link>
    </article>
  );
}
