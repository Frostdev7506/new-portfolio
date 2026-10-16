"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertDialog } from "radix-ui";
import { BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EditorDocument, EditorIndex } from "@/lib/blog-editor-types";
import { ArticleEditor } from "./article-editor";
import "@mdxeditor/editor/style.css";
import "./studio.css";

type Navigation = { slug: string } | { href: string };

export function BlogStudio({ initialSlug }: { initialSlug?: string }) {
  const [index, setIndex] = useState<EditorIndex | null>(null);
  const [document, setDocument] = useState<EditorDocument | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [pending, setPending] = useState<Navigation | null>(null);
  const allowedNavigation = useRef(false);
  const requestId = useRef(0);

  const onSaved = useCallback((saved: EditorDocument) => {
    setIndex((current) => current && ({ ...current, posts: current.posts.map((post) => post.slug === saved.slug ? { slug: saved.slug, title: saved.metadata.title, description: saved.metadata.description, seoTitle: saved.metadata.seoTitle, seoDescription: saved.metadata.seoDescription, draft: saved.metadata.draft } : post) }));
  }, []);

  const load = useCallback(async (slug: string) => {
    const id = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/dev/blog/${encodeURIComponent(slug)}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to load article.");
      if (id !== requestId.current) return;
      setDocument(result);
      onSaved(result);
      setDirty(false);
      window.history.replaceState(null, "", `/dev/blog?article=${encodeURIComponent(slug)}`);
    } catch (cause) {
      if (id === requestId.current) setError(cause instanceof Error ? cause.message : "Unable to load article.");
    } finally { if (id === requestId.current) setLoading(false); }
  }, [onSaved]);

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await fetch("/api/dev/blog", { signal: controller.signal, cache: "no-store" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to load articles.");
        setIndex(result);
        const slug = initialSlug || result.posts[0]?.slug;
        if (slug) await load(slug);
        else setLoading(false);
      } catch (cause) {
        if (controller.signal.aborted) return;
        setError(cause instanceof Error ? cause.message : "Unable to load articles.");
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [initialSlug, load]);

  useEffect(() => {
    const unload = (event: BeforeUnloadEvent) => {
      if (dirty && !allowedNavigation.current) { event.preventDefault(); event.returnValue = ""; }
    };
    const click = (event: MouseEvent) => {
      if (!dirty || allowedNavigation.current || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element).closest?.("a");
      if (!anchor?.href || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href);
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      event.preventDefault();
      event.stopPropagation();
      setPending({ href: anchor.href });
    };
    window.addEventListener("beforeunload", unload);
    window.document.addEventListener("click", click, true);
    return () => { window.removeEventListener("beforeunload", unload); window.document.removeEventListener("click", click, true); };
  }, [dirty]);

  function navigate(next: Navigation) {
    if ("slug" in next) void load(next.slug);
    else { allowedNavigation.current = true; window.location.assign(next.href); }
  }
  const posts = index?.posts.filter((post) => `${post.title} ${post.slug}`.toLowerCase().includes(query.toLowerCase())) ?? [];

  return (
    <div className="blog-studio">
      <header className="studio-header"><div><h1>Blog Studio</h1><p>Write and preview your articles.</p></div><span className="studio-dev-badge">Development only</span></header>
      <div className="studio-layout">
        <aside className="studio-library" aria-label="Choose an article">
          <div className="studio-library-heading"><BookOpen size={17} aria-hidden="true" /><h2>Your articles</h2><span>{index?.posts.length ?? "—"}</span></div>
          <label className="studio-search"><Search size={16} aria-hidden="true" /><input type="search" name="studio-search" autoComplete="off" aria-label="Find an article" placeholder="Find an article…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          <nav aria-label="Articles">{posts.map((post) => (
            <Button variant="ghost" key={post.slug} className="studio-article-button" aria-current={document?.slug === post.slug ? "page" : undefined} onClick={() => {
              if (document?.slug === post.slug) return;
              const next = { slug: post.slug };
              if (dirty) setPending(next); else navigate(next);
            }}><span>{post.title}</span><small>{post.draft ? "Draft" : "Published"}</small></Button>
          ))}</nav>
          {index && !posts.length && <p className="studio-empty">No articles match.</p>}
          <p className="studio-library-note">Changes save to local Markdown files. Commit and deploy when you’re ready to publish.</p>
        </aside>
        <div className="studio-main">
          {!!index?.errors.length && <div className="studio-notice" role="status">
            <p>Some article files could not be opened. Fix these files, then refresh the Studio.</p>
            <ul>{index.errors.map(({ fileName, message }) => <li key={fileName}><strong>{fileName}</strong>: {message}</li>)}</ul>
          </div>}
          {error && <div className="studio-error" role="alert">{error}<Button variant="outline" onClick={() => window.location.reload()}>Try again</Button></div>}
          {loading && <p role="status" className="studio-loading">Opening your article…</p>}
          {document && <div inert={loading}><ArticleEditor key={`${document.slug}:${document.revision}`} initial={document} covers={index?.covers ?? []} posts={index?.posts ?? []} onDirtyChange={setDirty} onSaved={onSaved} /></div>}
          {!document && !loading && !error && <p className="studio-empty">Choose an article to start writing.</p>}
        </div>
      </div>
      <AlertDialog.Root open={!!pending} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialog.Portal><AlertDialog.Overlay className="studio-dialog-overlay" /><AlertDialog.Content className="studio-dialog">
          <AlertDialog.Title>Leave with unsaved edits?</AlertDialog.Title>
          <AlertDialog.Description>Your changes have not been saved to the article file. Save or export them first. A recovery copy may be available in this browser when you return.</AlertDialog.Description>
          <div className="studio-actions"><AlertDialog.Cancel asChild><Button variant="outline">Keep editing</Button></AlertDialog.Cancel><AlertDialog.Action asChild><Button onClick={() => { if (pending) navigate(pending); setPending(null); }}>Leave article</Button></AlertDialog.Action></div>
        </AlertDialog.Content></AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}
