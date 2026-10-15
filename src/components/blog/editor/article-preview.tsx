"use client";

import Image from "next/image";
import { useDeferredValue, useMemo } from "react";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { YouTubeVideo } from "@/components/blog/youtube-video";
import { siteConfig } from "@/data/site";
import { getArticleImageSource, getArticleStructure } from "@/lib/article-content";
import { validateCoverDimensions } from "@/lib/blog-seo-validation";
import type { EditorDocument } from "@/lib/blog-editor-types";
import { formatDate } from "@/lib/utils";

export function ArticlePreview({ document }: { document: EditorDocument }) {
  const deferred = useDeferredValue(document);
  const structure = useMemo(() => {
    try { return { article: getArticleStructure(deferred.content), error: "" }; }
    catch (error) { return { article: null, error: error instanceof Error ? error.message : "Check the article content." }; }
  }, [deferred.content]);
  const { metadata, content } = deferred;
  const cover = getArticleImageSource(metadata.cover);
  let coverWidth = 1536;
  let coverHeight = 1024;
  try {
    validateCoverDimensions(metadata.coverWidth, metadata.coverHeight);
    coverWidth = metadata.coverWidth ?? coverWidth;
    coverHeight = metadata.coverHeight ?? coverHeight;
  } catch { /* Use the default ratio while dimensions are being edited. */ }
  const date = metadata.date.trim();
  const updated = metadata.updated?.trim();
  return (
    <section className="studio-preview" aria-label="Article preview">
      <div className="studio-preview-label">Article preview <span>{structure.article?.readtime}</span></div>
      <article className="article-page">
        <header className="article-header">
          <p className="article-category">{metadata.category}</p>
          <h1>{metadata.title || "Untitled article"}</h1>
          <p className="article-deck">{metadata.description}</p>
          <div className="article-byline">
            <span>{siteConfig.name}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={date}>{formatDate(date)}</time>
            {structure.article && <><span aria-hidden="true">·</span><span>{structure.article.readtime}</span></>}
            {metadata.draft && <><span aria-hidden="true">·</span><span>Draft</span></>}
          </div>
          {updated && updated !== date && (
            <p className="article-updated">Updated <time dateTime={updated}>{formatDate(updated)}</time></p>
          )}
          {metadata.youtubeId && /^[\w-]{11}$/.test(metadata.youtubeId) ? (
            <YouTubeVideo key={metadata.youtubeId} videoId={metadata.youtubeId} title={metadata.title} />
          ) : cover?.startsWith("/illustrations/") && !cover.includes("..") ? (
            <Image src={cover} alt={metadata.coverAlt} width={coverWidth} height={coverHeight} sizes="(max-width: 800px) 100vw, 600px" className="studio-cover-preview" />
          ) : null}
        </header>
        {structure.error ? <p className="studio-error" role="status">Preview paused: {structure.error}</p> : (
          <div className="article-body"><MarkdownContent content={content} /></div>
        )}
      </article>
    </section>
  );
}
