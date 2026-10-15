import assert from "node:assert/strict";
import { test } from "node:test";
import matter from "gray-matter";
import { serializeEditorDocument } from "./blog-editor-export.ts";
import { parsePost } from "./post-content.ts";

const document = {
  slug: "export-example",
  revision: "a".repeat(64),
  content: "## A useful idea\n\nKeep the **article body** exactly as written.\n",
  metadata: {
    title: "Example article",
    description: "A summary of this article.",
    category: "Web engineering",
    takeaway: "Keep valid exports.",
    cover: "/illustrations/example.png",
    coverAlt: "An example illustration.",
    date: "2026-10-10",
    tags: ["React", "SEO"],
    draft: false,
  },
};

test("cleared optional settings export valid article frontmatter without changing the draft", () => {
  const draft = structuredClone(document);
  for (const key of ["seoTitle", "seoDescription", "canonicalUrl", "ogTitle", "ogDescription", "ogImage", "ogImageAlt", "updated", "source", "youtubeId"]) {
    draft.metadata[key] = "  ";
  }
  draft.metadata.title = "  Example article  ";
  draft.metadata.tags = [" React ", " SEO "];
  const before = structuredClone(draft);
  const source = serializeEditorDocument(draft);
  const post = parsePost(source, `${draft.slug}.md`);
  assert.equal(post.title, "Example article");
  assert.deepEqual(post.tags, ["React", "SEO"]);
  assert.equal(post.seoTitle, undefined);
  assert.equal(post.ogImage, undefined);
  assert.equal(post.updated, post.date);
  assert.equal(post.content, draft.content);
  assert.deepEqual(draft, before);
  assert.ok(!source.includes('seoTitle: ""'));
});

test("exports preserve false, zero, numeric directives, and escaped scalar text", () => {
  const draft = structuredClone(document);
  Object.assign(draft.metadata, {
    title: 'Example: "quotes" and \\ backslashes',
    noindex: false,
    maxSnippet: 0,
    maxVideoPreview: -1,
    maxImagePreview: " large ",
  });
  const { data, content } = matter(serializeEditorDocument(draft));
  assert.equal(data.title, draft.metadata.title);
  assert.equal(data.draft, false);
  assert.equal(data.noindex, false);
  assert.equal(data.maxSnippet, 0);
  assert.equal(data.maxVideoPreview, -1);
  assert.equal(data.maxImagePreview, "large");
  assert.equal(content, draft.content);
});

test("exports preserve body boundaries, leading thematic breaks, and trailing whitespace", () => {
  for (const content of ["---\n\nAn opening rule.\n", "\n---\n\nAn opening rule.\n", "A paragraph without a newline", "A paragraph with trailing spaces.  \n\n"]) {
    const draft = { ...document, content };
    const post = parsePost(serializeEditorDocument(draft), `${draft.slug}.md`);
    assert.equal(post.content, content);
  }
});

test("required blank values are preserved for validation rather than silently omitted", () => {
  const draft = { ...document, metadata: { ...document.metadata, title: " " } };
  const source = serializeEditorDocument(draft);
  assert.equal(matter(source).data.title, "");
  assert.throws(() => parsePost(source, `${draft.slug}.md`), /missing title/);
});


test("cover dimensions survive Markdown export and can be removed", () => {
  const draft = { ...document, metadata: { ...document.metadata, coverWidth: 1200, coverHeight: 630 } };
  const post = parsePost(serializeEditorDocument(draft), `${draft.slug}.md`);
  assert.equal(post.coverWidth, 1200);
  assert.equal(post.coverHeight, 630);
  draft.metadata.coverWidth = undefined;
  draft.metadata.coverHeight = undefined;
  const cleared = parsePost(serializeEditorDocument(draft), `${draft.slug}.md`);
  assert.equal(Object.hasOwn(cleared, "coverWidth"), false);
  assert.equal(Object.hasOwn(cleared, "coverHeight"), false);
});
