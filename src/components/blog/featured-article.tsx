import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { notebook } from "@/data/notebook";
import { TextLink } from "@/components/shared/text-link";

export function FeaturedArticle({
  post,
  home = false,
}: {
  post: BlogPost;
  home?: boolean;
}) {
  const Heading = home ? "h1" : "h2";

  return (
    <article
      className={
        home ? "featured-article home-feature" : "featured-article blog-feature"
      }
    >
      <div className="feature-copy">
        <p className="eyebrow">{home ? "Open notebook." : "Featured"}</p>
        <Heading>
          <Link href={"/blog/" + post.slug}>{post.title}</Link>
        </Heading>
        <p className="feature-description">{notebook.featuredDescription}</p>
        {!home && (
          <p className="post-meta">
            {formatDate(post.date)}
            <span>·</span>
            {post.readtime}
            <span className="meta-tags">{post.tags.join(" · ")}</span>
          </p>
        )}
        <div className="feature-links">
          <TextLink href={"/blog/" + post.slug}>Read article</TextLink>
          {home && (
            <TextLink href="/blog" className="quiet-link">
              All writing
            </TextLink>
          )}
        </div>
      </div>
      <Link
        href={"/blog/" + post.slug}
        className="feature-art-link"
        aria-label={"Read " + post.title}
      >
        <Image
          src="/illustrations/web-rendering.png"
          alt="A request travels from a browser to a server, which responds with HTML, CSS, and JavaScript for the browser to render."
          width={1942}
          height={809}
          className="feature-art"
          sizes="(max-width: 900px) 100vw, (max-width: 1200px) 70vw, 1040px"
          priority
        />
      </Link>
    </article>
  );
}
