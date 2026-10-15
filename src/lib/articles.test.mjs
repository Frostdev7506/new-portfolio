import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getArticleStructure, parseDiagram } from "./article-content.ts";
import {
  parsePost,
  selectRelatedPosts,
  toPostSummary,
} from "./post-content.ts";
import { buildRss, escapeXml } from "./rss.ts";

const fixture = `---
title: "Example article"
description: "A small article for testing metadata."
date: "2026-10-10"
category: "Web engineering"
tags: ["React", "Performance"]
cover: "/illustrations/example.png"
coverAlt: "A small diagram used as the example cover."
takeaway: "Verify the article metadata."
---
## A useful idea

An example paragraph.
`;
const examplePost = parsePost(fixture, "example.md");

test("TOC IDs match rendered Markdown including repeated, formatted, and Unicode headings", () => {
  const content =
    "## A **useful** idea\n\n### Café & code\n\n## A **useful** idea\n\n```text\n## Not a heading\n```";
  const structure = getArticleStructure(content);
  const html = renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] },
      content,
    ),
  );
  const ids = [...html.matchAll(/<h[23] id="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(
    structure.headings.map((heading) => heading.id),
    ids,
  );
  assert.equal(ids.length, 3);
  assert.equal(new Set(ids).size, 3);
});

test("reading time follows content length and diagram prose, not frontmatter estimates", () => {
  assert.equal(getArticleStructure("word ".repeat(401)).readingMinutes, 3);
  const diagram = {
    title: "Two stages",
    caption: "Read then write",
    layout: "flow",
    steps: [
      { label: "Read", detail: "Get data" },
      { label: "Write", detail: "Save data" },
    ],
  };
  const info = getArticleStructure(
    `\`\`\`diagram\n${JSON.stringify(diagram)}\n\`\`\``,
  );
  assert.equal(info.diagramCount, 1);
  assert.equal(info.wordCount, 11);
  assert.throws(() => getArticleStructure("# Duplicate page heading"), /h2/);
});

test("bad dates, absent metadata, external covers, and broken diagrams fail early", () => {
  assert.throws(
    () => parsePost(fixture.replace('"2026-10-10"', '"2026-02-30"'), "post.md"),
    /invalid date/,
  );
  assert.throws(
    () => parsePost(fixture.replace(/^coverAlt:.*\n/m, ""), "post.md"),
    /coverAlt/,
  );
  assert.throws(
    () =>
      parsePost(
        fixture.replace(
          "/illustrations/example.png",
          "https://example.com/art.png",
        ),
        "post.md",
      ),
    /local illustration/,
  );
  assert.throws(
    () => parseDiagram('{"layout":"flow","steps":[]}'),
    /diagram needs/,
  );
  assert.throws(() => parseDiagram("not json"));
});

test("optional YouTube IDs accept the four series videos and reject unsafe values", () => {
  assert.equal(examplePost.youtubeId, undefined);
  for (const id of [
    "fdulpDUOA_E",
    "5rKn3R9MxU8",
    "vNJjm7b1QDU",
    "o20J-96a9RY",
  ]) {
    const post = parsePost(
      fixture.replace("---\n", `---\nyoutubeId: " ${id} "\n`),
      "example.md",
    );
    assert.equal(post.youtubeId, id);
    assert.equal(toPostSummary(post).youtubeId, id);
  }
  for (const value of [
    '""',
    '"short"',
    '"fdulpDUOA_E/"',
    '"https://youtube.com/shorts/fdulpDUOA_E"',
    '"abcdefghij?"',
    "null",
    "12345678901",
  ]) {
    assert.throws(
      () =>
        parsePost(
          fixture.replace("---\n", `---\nyoutubeId: ${value}\n`),
          "example.md",
        ),
      /youtubeId/,
    );
  }
});

test("optional SEO titles are trimmed and reject blank or non-string overrides", () => {
  assert.equal(examplePost.seoTitle, undefined);
  const post = parsePost(
    fixture.replace("---\n", '---\nseoTitle: " Semantic Caching "\n'),
    "example.md",
  );
  assert.equal(post.seoTitle, "Semantic Caching");
  assert.equal(toPostSummary(post).seoTitle, "Semantic Caching");
  for (const value of ['" "', "null", "123", "false"]) {
    assert.throws(
      () =>
        parsePost(
          fixture.replace("---\n", `---\nseoTitle: ${value}\n`),
          "example.md",
        ),
      /seoTitle/,
    );
  }
});

test("cover dimensions are omitted for older posts and retained as a positive integer pair", () => {
  for (const post of [examplePost, toPostSummary(examplePost)]) {
    assert.equal("coverWidth" in post, false);
    assert.equal("coverHeight" in post, false);
  }
  for (const [width, height] of [[1200, 630], [1, 1]]) {
    const post = parsePost(
      fixture.replace(
        "---\n",
        `---\ncoverWidth: ${width}\ncoverHeight: ${height}\n`,
      ),
      "example.md",
    );
    assert.equal(post.coverWidth, width);
    assert.equal(post.coverHeight, height);
    assert.equal(toPostSummary(post).coverWidth, width);
    assert.equal(toPostSummary(post).coverHeight, height);
  }
});

test("cover dimensions reject lone values, non-numbers, and invalid integers", () => {
  for (const fields of [
    "coverWidth: 1200",
    "coverHeight: 630",
    "coverWidth: 0\ncoverHeight: 630",
    "coverWidth: 1200\ncoverHeight: -1",
    "coverWidth: 1200.5\ncoverHeight: 630",
    "coverWidth: 1200\ncoverHeight: 630.5",
    'coverWidth: "1200"\ncoverHeight: 630',
    'coverWidth: 1200\ncoverHeight: "630"',
    "coverWidth: null\ncoverHeight: 630",
    "coverWidth: 1200\ncoverHeight: false",
    "coverWidth: []\ncoverHeight: 630",
    "coverWidth: .inf\ncoverHeight: 630",
    "coverWidth: 1200\ncoverHeight: .nan",
    "coverWidth: 9007199254740992\ncoverHeight: 630",
  ]) {
    assert.throws(
      () =>
        parsePost(
          fixture.replace("---\n", `---\n${fields}\n`),
          "example.md",
        ),
      /example\.md: coverWidth and coverHeight must be positive integers supplied together/,
      fields,
    );
  }
});

test("related articles favor shared topics and exclude current article and drafts", () => {
  const base = toPostSummary(examplePost);
  const current = {
    ...base,
    slug: "current",
    tags: ["Caching"],
    category: "Systems",
  };
  const unrelated = {
    ...base,
    slug: "unrelated",
    tags: ["Other"],
    category: "Other",
  };
  const match = {
    ...base,
    slug: "match",
    tags: ["Caching"],
    category: "Systems",
  };
  const draft = { ...match, slug: "draft", draft: true };
  assert.deepEqual(
    selectRelatedPosts([unrelated, current, draft, match], current).map(
      (post) => post.slug,
    ),
    ["match", "unrelated"],
  );
  assert.equal("content" in base, false);
  assert.equal("headings" in base, false);
});

test("RSS escapes user-visible text, uses stable permalinks, and omits drafts", () => {
  const base = toPostSummary(examplePost);
  const rss = buildRss(
    [
      { ...base, title: 'A & B <C> "D"', updated: "2026-10-11" },
      { ...base, slug: "hidden", draft: true },
    ],
    { url: "https://example.com/", name: "A & B", description: "Notebook" },
  );
  assert.ok(rss.includes("A &amp; B &lt;C&gt; &quot;D&quot;"));
  assert.ok(
    rss.includes(
      `<guid isPermaLink="true">https://example.com/blog/${base.slug}</guid>`,
    ),
  );
  assert.ok(rss.includes("11 Oct 2026"));
  assert.equal(rss.includes("/blog/hidden"), false);
  assert.equal(escapeXml("'&<>\""), "&apos;&amp;&lt;&gt;&quot;");
});
