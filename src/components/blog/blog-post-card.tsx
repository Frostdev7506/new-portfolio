import Link from "next/link";
import type { BlogPost } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group relative h-full bg-muted/30 border border-border/50 rounded-2xl p-6 transition-all duration-500 hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col">
      {/* Hover reveal gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />

      <Link href={`/blog/${post.slug}`} className="flex-1">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs tracking-widest uppercase text-muted-foreground/60 font-medium font-mono">
          <span>{formatDate(post.date)}</span>
          <span className="w-1 h-1 rounded-full bg-primary/40 block"></span>
          <span>{post.readtime}</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground/90 group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-3">
          {post.title}
        </h2>

        <p className="text-sm font-light leading-relaxed text-muted-foreground line-clamp-3">
          {post.description}
        </p>
      </Link>

      <div className="mt-6 pt-6 border-t border-border/40 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge
            key={`${post.slug}-${tag}`}
            variant="outline"
            className="rounded-full px-3 py-1 text-[10px] tracking-wider uppercase border-border/60 text-muted-foreground bg-transparent font-medium group-hover:border-primary/30 group-hover:text-primary/80 transition-colors duration-300"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </article>
  );
}
