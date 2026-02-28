import Link from "next/link";
import type { BlogPost } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group relative py-12 border-b border-border/40 transition-colors duration-500 hover:bg-muted/10 flex flex-col">
      <Link href={`/blog/${post.slug}`} className="flex-1 px-4 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 font-medium">
          <span>{formatDate(post.date)}</span>
          <span className="w-8 h-[1px] bg-primary/20 block"></span>
          <span>{post.readtime}</span>
        </div>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tighter text-foreground group-hover:text-primary transition-colors duration-400 mb-4 pr-8">
          {post.title}
        </h2>

        <p className="text-base font-light leading-relaxed text-muted-foreground/80 line-clamp-3 max-w-3xl">
          {post.description}
        </p>
      </Link>

      <div className="mt-8 px-4 lg:px-8 flex flex-wrap gap-3">
        {post.tags.map((tag) => (
          <Badge
            key={`${post.slug}-${tag}`}
            variant="outline"
            className="rounded-none px-3 py-1 text-[9px] tracking-[0.2em] uppercase border-border/40 text-muted-foreground bg-transparent font-medium group-hover:border-primary/30 group-hover:text-primary/80 transition-all duration-300"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </article>
  );
}
