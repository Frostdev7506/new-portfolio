"use client";

import { useMemo, useRef, useState } from "react";
import { Search, Rss, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PostSummary } from "@/lib/post-content";
import { BlogPostCard } from "./blog-post-card";

export function BlogExplorer({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const searchInput = useRef<HTMLInputElement>(null);
  const hasFilters = query.length > 0 || category !== "All topics";
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

  function resetFilters() {
    setQuery("");
    setCategory("All topics");
    searchInput.current?.focus();
  }

  return (
    <section className="blog-library" aria-labelledby="library-heading">
      <div className="library-heading">
        <h2 id="library-heading">All articles</h2>
        <a className="rss-link" href="/feed.xml" type="application/rss+xml" aria-label="RSS feed">
          <Rss aria-hidden="true" /> RSS
        </a>
      </div>
      <div className="blog-filters">
        <div className="blog-search" role="search" aria-label="Articles">
          <Search aria-hidden="true" />
          <label className="sr-only" htmlFor="article-search">Search articles</label>
          <input
            ref={searchInput}
            id="article-search"
            type="search"
            name="article-search"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles or keywords…"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="search-clear"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                searchInput.current?.focus();
              }}
            >
              <X aria-hidden="true" />
            </Button>
          )}
        </div>
        <div className="blog-topics" role="group" aria-label="Filter by topic">
          {categories.map((item) => (
            <Button
              key={item}
              type="button"
              variant="ghost"
              className="topic-button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
              <span className="topic-count">
                {item === "All topics"
                  ? posts.length
                  : posts.filter((post) => post.category === item).length}
              </span>
            </Button>
          ))}
        </div>
      </div>
      <div className="library-results">
        <p className="library-count" role="status" aria-atomic="true">
          {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          {category !== "All topics" ? ` in ${category}` : ""}
          {query.trim() ? ` matching “${query.trim()}”` : ""}
        </p>
        {hasFilters && (
          <Button type="button" variant="link" className="library-reset" onClick={resetFilters}>
            Reset filters
          </Button>
        )}
      </div>
      <div className="post-list">
        {filtered.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
      {!filtered.length && (
        <div className="blog-empty">
          <h3>No articles found.</h3>
          <p>Try a broader term, or reset your filters.</p>
        </div>
      )}
    </section>
  );
}
