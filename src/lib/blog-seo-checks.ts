import GithubSlugger from "github-slugger";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { toString } from "mdast-util-to-string";
import type { Root, RootContent } from "mdast";
import { getArticleImageSource, getArticleStructure } from "./article-content.ts";
import type { ArticleHeading } from "./article-content.ts";
import type { BlogEditorMetadata } from "./blog-editor-types.ts";

type BlogSeoCheck = {
  id: string;
  status: "pass" | "warning" | "error";
  label: string;
  detail: string;
};

type SearchPost = Pick<BlogEditorMetadata, "title" | "description" | "seoTitle" | "seoDescription"> & { slug: string; draft?: boolean };
type AuditDocument = { slug: string; content: string; metadata: BlogEditorMetadata };
const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
const examples = (values: Set<string>) => [...values].slice(0, 3).join(", ") + (values.size > 3 ? ` (+${values.size - 3} more)` : "");

/** Editorial checks against the renderer and local article index, not a ranking score. */
export function getBlogSeoChecks(document: AuditDocument, site: { url: string; name: string }, posts: SearchPost[]) {
  const checks: BlogSeoCheck[] = [];
  const add = (id: string, status: BlogSeoCheck["status"], label: string, detail: string) => checks.push({ id, status, label, detail });
  const { metadata, content, slug } = document;
  const headings: ArticleHeading[] = [];
  let wordCount = 0;
  let tree: Root | undefined;
  try {
    tree = unified().use(remarkParse).use(remarkGfm).parse(content) as Root;
    const structure = getArticleStructure(content);
    wordCount = structure.wordCount;
    add("content", content.trim() ? "pass" : "error", "Article content", content.trim() ? `${wordCount} words. Markdown and diagrams can render.` : "Add article content before saving.");
  } catch (cause) {
    add("content", "error", "Article content", cause instanceof Error ? cause.message : "The article could not be parsed.");
  }

  if (tree) {
    const nodes: (Root | RootContent)[] = [];
    function visit(node: Root | RootContent) {
      nodes.push(node);
      if ("children" in node) node.children.forEach(visit);
    }
    visit(tree);
    const slugger = new GithubSlugger();
    for (const node of nodes) {
      if (node.type === "heading") {
        const text = toString(node);
        headings.push({ depth: node.depth, text, id: slugger.slug(text) });
      }
    }
    const skipped: string[] = [];
    let previousDepth = 1;
    for (const heading of headings) {
      if (heading.depth > previousDepth + 1) skipped.push(`H${previousDepth} → H${heading.depth}: ${heading.text || "empty heading"}`);
      previousDepth = heading.depth;
    }
    const invalidHeadings = headings.filter((heading) => heading.depth === 1 || !heading.text.trim());
    add("headings", invalidHeadings.length ? "error" : skipped.length || !headings.length ? "warning" : "pass", "Heading outline",
      invalidHeadings.length ? "Use descriptive H2–H6 headings. The page already supplies the article’s H1." : skipped.length ? `Review skipped levels: ${skipped.slice(0, 3).join("; ")}.` : headings.length ? `${headings.length} headings follow a sequential outline.` : "No section headings. Add them where they help readers navigate; short articles may not need them.");

    const definitions = new Map(nodes.filter((node) => node.type === "definition").map((node) => [normalize(node.identifier), node.url]));
    const unsupportedImages = new Set<string>();
    const missingAlt = new Set<string>();
    const unresolved = new Set<string>();
    const invalidLinks = new Set<string>();
    const unknownTargets = new Set<string>();
    const draftTargets = new Set<string>();
    const articleDrafts = new Map(posts.map((post) => [post.slug, post.draft === true]));
    articleDrafts.set(slug, metadata.draft);
    const headingIds = new Set([...headings.map((heading) => heading.id), "article-top", "article-content", "main-content", "related-title"]);
    let imageCount = 0;
    let checkedLinks = 0;
    let pageUrl: URL | undefined;
    try { pageUrl = new URL(`/blog/${slug}`, site.url); } catch { /* A partial site URL should not crash the editor. */ }
    function checkLink(value: string) {
      if (!pageUrl) return;
      let target: URL;
      try { target = new URL(value, pageUrl); } catch { invalidLinks.add(value); return; }
      if (target.origin !== pageUrl.origin || !target.pathname.startsWith("/blog/")) return;
      checkedLinks++;
      const match = /^\/blog\/([^/]+)\/?$/.exec(target.pathname);
      let targetSlug = "";
      try { targetSlug = match ? decodeURIComponent(match[1]) : ""; } catch { /* Invalid encoded paths are reported below. */ }
      if (!articleDrafts.has(targetSlug)) { unknownTargets.add(value); return; }
      if (articleDrafts.get(targetSlug)) draftTargets.add(value);
      if (targetSlug === slug && target.hash) {
        let anchor = "";
        try { anchor = decodeURIComponent(target.hash.slice(1)); } catch { /* Invalid encoded anchors are reported below. */ }
        if (!headingIds.has(anchor)) invalidLinks.add(value);
      }
    }
    for (const node of nodes) {
      if (node.type === "image" || node.type === "imageReference") {
        imageCount++;
        const source = node.type === "image" ? node.url : definitions.get(normalize(node.identifier));
        if (source !== undefined && !getArticleImageSource(source)) unsupportedImages.add(source || "empty image URL");
        if (!node.alt?.trim()) missingAlt.add(source || "image reference");
        if (source === undefined && node.type === "imageReference") unresolved.add(node.identifier);
      }
      if (node.type === "link") checkLink(node.url);
      if (node.type === "linkReference") {
        const url = definitions.get(normalize(node.identifier));
        if (url === undefined) unresolved.add(node.identifier);
        else checkLink(url);
      }
      // CommonMark leaves unresolved explicit/collapsed references as text. Plain [text] is ambiguous.
      if (node.type === "text" && node.position?.start.offset !== undefined && node.position.end.offset !== undefined) {
        const source = content.slice(node.position.start.offset, node.position.end.offset);
        const references = /(^|[^\\])!?\[([^\]\n]+)\]\[([^\]\n]*)\]/g;
        for (const match of source.matchAll(references)) {
          const identifier = match[3] || match[2];
          if (!definitions.has(normalize(identifier))) unresolved.add(identifier);
        }
      }
    }
    add("images", unsupportedImages.size ? "error" : missingAlt.size ? "warning" : "pass", "Article images",
      unsupportedImages.size ? `These images will not render: ${examples(unsupportedImages)}. Use a root-relative path or HTTPS URL.` : missingAlt.size ? `Review empty image descriptions: ${examples(missingAlt)}. Empty alt text is appropriate only for decorative images.` : imageCount ? `${imageCount} images have supported URLs and descriptions. Image availability is not checked.` : "No inline images to check.");
    add("references", unresolved.size ? "warning" : "pass", "Markdown references", unresolved.size ? `Missing definitions: ${examples(unresolved)}. These references render as plain text.` : "No unresolved explicit image or link references found.");
    const linkIssues = [
      !pageUrl ? "Set a valid site URL to check article links." : "",
      unknownTargets.size ? `Not found in the local article index: ${examples(unknownTargets)}. Verify the saved URL or redirect.` : "",
      draftTargets.size ? `Links target drafts without public pages: ${examples(draftTargets)}. Publish those articles before linking publicly.` : "",
      invalidLinks.size ? `Review invalid URLs or missing current-page anchors: ${examples(invalidLinks)}.` : "",
    ].filter(Boolean);
    add("links", linkIssues.length ? "warning" : "pass", "Local article links", linkIssues.length ? linkIssues.join(" ") : `${checkedLinks} local article links checked. External URLs and other pages’ anchors are not checked.`);
  }

  const searchTitle = metadata.seoTitle?.trim() || `${metadata.title.trim()} | ${site.name}`;
  const searchDescription = metadata.seoDescription?.trim() || metadata.description.trim();
  add("search-title", !metadata.title.trim() && !metadata.seoTitle?.trim() ? "error" : searchTitle.length > 70 ? "warning" : "pass", "Search title",
    !metadata.title.trim() && !metadata.seoTitle?.trim() ? "Add an article title or search title." : `${searchTitle.length} characters. ${searchTitle.length > 70 ? "Consider a more concise title; previews may truncate it. " : ""}There is no fixed ranking limit, and search engines may rewrite it.`);
  add("search-description", !searchDescription ? "error" : searchDescription.length > 180 ? "warning" : "pass", "Meta description",
    !searchDescription ? "Add an article description or meta description." : `${searchDescription.length} characters. ${searchDescription.length > 180 ? "The full description may not fit in a search snippet. " : ""}Search engines choose snippets based on the query and display width.`);
  const others = posts.filter((post) => post.slug !== slug);
  const duplicateTitles = new Set(others.filter((post) => normalize(post.seoTitle?.trim() || `${post.title.trim()} | ${site.name}`) === normalize(searchTitle)).map((post) => post.slug));
  const duplicateDescriptions = new Set(others.filter((post) => searchDescription && normalize(post.seoDescription?.trim() || post.description) === normalize(searchDescription)).map((post) => post.slug));
  add("unique-title", duplicateTitles.size ? "warning" : "pass", "Distinct search title", duplicateTitles.size ? `Also used by: ${examples(duplicateTitles)}. Use a title specific to this article.` : "No duplicate effective search title in the local article index.");
  add("unique-description", duplicateDescriptions.size ? "warning" : "pass", "Distinct meta description", duplicateDescriptions.size ? `Also used by: ${examples(duplicateDescriptions)}. Summarize what makes this article different.` : "No duplicate effective meta description in the local article index.");
  const socialImage = metadata.ogImage?.trim() || metadata.cover.trim();
  const twitterImage = metadata.twitterImage?.trim() || socialImage;
  const incompatibleImages = [["Open Graph", socialImage], ["X/Twitter", twitterImage]]
    .filter(([, image]) => !/\.(png|jpe?g|webp|gif)$/i.test(image)).map(([name]) => name);
  add("social-image", incompatibleImages.length ? "warning" : "pass", "Social image format", incompatibleImages.length ? `${incompatibleImages.join(" and ")}: use a PNG, JPEG, WebP, or GIF image for broad sharing compatibility. SVG covers can remain on the article with separate raster social images.` : "Open Graph and X/Twitter use raster images. Check their crop and resolution in the social previews; platform previews can differ.");
  return { checks, headings, wordCount };
}
