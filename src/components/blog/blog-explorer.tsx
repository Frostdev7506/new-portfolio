"use client";

import { useMemo, useState } from "react";
import { Search, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PostSummary } from "@/lib/post-content";
import { BlogPostCard } from "./blog-post-card";

export function BlogExplorer({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const categories = [
    "All topics",
    ...new Set(posts.map((post) => post.category)),
  ];
  const filtered = useMemo(() => {
    const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    return posts.filter((post) => {
      const text = [post.title, post.description, ...post.tags]
        .join(" ")
        .toLocaleLowerCase();
      return (
        (category === "All topics" || post.category === category) &&
        terms.every((term) => text.includes(term))
      );
    });
  }, [posts, query, category]);
  return (
    <section className="blog-library" aria-labelledby="library-heading">
      <div className="library-heading">
        <div>
          <p className="eyebrow">The notebook index</p>
          <h2 id="library-heading">Find your next idea.</h2>
        </div>
        <a className="rss-link" href="/feed.xml">
          <Rss aria-hidden="true" /> RSS feed
        </a>
      </div>
      <label className="blog-search">
        <Search aria-hidden="true" />
        <span className="sr-only">Search articles</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search topics, tools, or a question…"
        />
      </label>
      <div className="blog-topics" role="group" aria-label="Filter by topic">
        {categories.map((item) => (
          <Button
            key={item}
            variant="ghost"
            className="topic-button"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
            <span>
              {item === "All topics"
                ? posts.length
                : posts.filter((post) => post.category === item).length}
            </span>
          </Button>
        ))}
      </div>
      <p className="library-count" role="status">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        {query.trim() ? ` matching “${query.trim()}”` : " to explore"}
      </p>
      <div className="post-list">
        {filtered.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
      {!filtered.length && (
        <div className="blog-empty">
          <h3>No pages turned up.</h3>
          <p>Try a broader term, or browse the whole notebook.</p>
          <Button
            variant="outline"
            onClick={() => {
              setQuery("");
              setCategory("All topics");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </section>
  );
}
