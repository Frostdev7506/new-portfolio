import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { toString } from "mdast-util-to-string";
import { siteConfig } from "../data/site.ts";
import { notebook, experience, education } from "../data/notebook.ts";
import { projects } from "../data/projects.ts";
import { parsePost, toPostSummary } from "./post-content.ts";
import {
  buildAgentIndex,
  buildArticleMarkdown,
  buildFullAgentContent,
} from "./agent-content.ts";

const post = parsePost(`---
title: "Example article"
description: "A useful description."
date: "2026-10-10"
updated: "2026-10-11"
category: "Web engineering"
tags: ["React", "Performance"]
cover: "/illustrations/example.png"
coverAlt: "An example illustration."
takeaway: "Check the exported article."
source: "https://www.linkedin.com/posts/example"
---
## The useful section

The complete body belongs in the article export.
`, "example.md");

function tree(markdown) {
  return unified().use(remarkParse).parse(markdown);
}

function destinations(node) {
  return [
    ...("url" in node ? [node.url] : []),
    ...(node.children?.flatMap(destinations) ?? []),
  ];
}

test("index and full bundle omit drafts and retain public profile, projects, and articles", () => {
  const draft = {
    ...post,
    slug: "private-draft",
    title: "Unpublished secret title",
    content: "Unpublished secret body",
    draft: true,
  };
  const index = buildAgentIndex([draft, post].map(toPostSummary));
  const full = buildFullAgentContent([draft, post]);
  assert.ok(index.includes(`/blog/${post.slug}/index.md`));
  assert.ok(index.includes(post.description));
  for (const output of [index, full]) {
    assert.equal(output.includes("private-draft"), false);
    assert.equal(output.includes("Unpublished secret"), false);
  }
  for (const paragraph of notebook.about) assert.ok(full.includes(paragraph));
  for (const job of experience) {
    assert.ok(full.includes(job.company));
    assert.ok(full.includes(job.details));
    if (job.description) assert.ok(full.includes(job.description));
  }
  assert.ok(full.includes(education.degree));
  for (const project of projects) {
    assert.ok(full.includes(project.description));
    assert.ok(full.includes(project.link));
  }
  assert.ok(full.includes(siteConfig.email));
  assert.ok(full.includes(siteConfig.social.youtube));
  assert.ok(full.includes(post.content.trim()));
  assert.ok(full.includes("does not reproduce every website page"));
  for (const path of ["/resume", "/privacy", "/editorial-policy"]) {
    assert.ok(index.includes(path));
  }
});

test("aggregates respect canonical, indexing, following, and preview restrictions", () => {
  const restricted = [
    { draft: true },
    { noindex: true },
    { nofollow: true },
    { nosnippet: true },
    { maxSnippet: 0 },
    { maxSnippet: 180 },
    { maxVideoPreview: 0 },
    { maxVideoPreview: 30 },
    { maxImagePreview: "none" },
    { maxImagePreview: "standard" },
    { canonicalUrl: "https://publisher.example/original" },
    { canonicalUrl: new URL("/blog/another-original", siteConfig.url).href },
  ].map((fields, index) => ({
    ...post,
    slug: `restricted-${index}`,
    title: `Restricted title ${index}`,
    description: `Restricted description ${index}`,
    content: `Restricted body ${index}`,
    ...fields,
  }));
  const allowed = [
    post,
    { ...post, slug: "unlimited", nofollow: false, nosnippet: false, maxSnippet: -1, maxVideoPreview: -1, maxImagePreview: "large" },
    { ...post, slug: "self-canonical", canonicalUrl: new URL("/blog/self-canonical/", siteConfig.url).href },
  ];
  const index = buildAgentIndex([...restricted, ...allowed].map(toPostSummary));
  const full = buildFullAgentContent([...restricted, ...allowed]);
  for (const article of restricted) {
    for (const output of [index, full]) {
      for (const value of [article.slug, article.title, article.description, article.content]) {
        assert.equal(output.includes(value), false, `${article.slug}: ${value}`);
      }
    }
  }
  for (const article of allowed) {
    assert.ok(index.includes(`/blog/${article.slug}/index.md`));
    assert.ok(full.includes(`/blog/${article.slug}`));
  }
});

test("canonical overrides affect citation metadata while source links retain their local origin", () => {
  const canonicalUrl = "https://publisher.example/original";
  const output = buildArticleMarkdown({
    ...post,
    canonicalUrl,
    content: "[Root](/about)\n\n[Nearby](./chart.png)\n\n[Section](#example)",
  });
  assert.ok(output.includes(`- Canonical URL: [${post.title}](<${canonicalUrl}>)`));
  const urls = destinations(tree(output));
  const permalink = new URL(`/blog/${post.slug}`, siteConfig.url).href;
  for (const destination of ["/about", "./chart.png", "#example"]) {
    assert.ok(urls.includes(new URL(destination, permalink).href));
    assert.equal(urls.includes(new URL(destination, canonicalUrl).href), false);
  }
});

test("video articles expose the matching YouTube link and text articles omit it", () => {
  const youtubeId = "fdulpDUOA_E";
  const article = { ...post, youtubeId };
  const expected = `- Video: [Watch on YouTube](<https://www.youtube.com/watch?v=${youtubeId}>)`;
  assert.ok(buildArticleMarkdown(article).includes(expected));
  assert.ok(buildFullAgentContent([article]).includes(expected));
  assert.equal(buildArticleMarkdown(post).includes("- Video:"), false);
});

test("exported links stay absolute when the configured website URL has a trailing slash", () => {
  const originalUrl = siteConfig.url;
  siteConfig.url = "https://example.com/";
  try {
    for (const output of [buildAgentIndex([post]), buildFullAgentContent([post])]) {
      const urls = destinations(tree(output));
      assert.ok(urls.length > 10);
      for (const url of urls) assert.match(url, /^(https?:|mailto:)/);
      assert.equal(output.includes("https://example.com//"), false);
    }
    const article = buildArticleMarkdown(post);
    assert.ok(article.includes("https://example.com/blog/example"));
    assert.ok(article.includes("Published: 2026-10-10"));
    assert.ok(article.includes("Updated: 2026-10-11"));
    assert.ok(article.includes("Original source:"));
    assert.ok(article.includes(post.source));
  } finally {
    siteConfig.url = originalUrl;
  }
});

test("relative links, images, and references resolve against canonical HTML while code stays exact", () => {
  const code = [
    "`[inline code](/do-not-change)`",
    "```javascript\nconst example = '[code](/do-not-change)';\n```",
    "```diagram\n{\"title\":\"[diagram text](/do-not-change)\"}\n```",
    "    [indented code](/do-not-change)",
  ];
  const content = [
    "[Next](/blog/next \"Next article\")",
    "[Section](#section)",
    "[Nearby](./nearby.md)",
    "[Parent](../about)",
    "![Nested [alt]](</illustrations/chart name.png> \"Chart\")",
    "[Reference][guide]",
    "[guide]: /blog/reference \"Reference title\"",
    "[Escaped angle](<foo\\>bar>)",
    "[Escaped reference][escaped]",
    "[escaped]: <reference\\>path>",
    "[External](https://example.org/article)",
    ...code,
  ].join("\n\n");
  const output = buildArticleMarkdown({ ...post, content });
  const canonical = new URL(`/blog/${post.slug}`, siteConfig.url).href;
  const urls = destinations(tree(output));
  for (const destination of [
    "/blog/next", "#section", "./nearby.md", "../about",
    "/illustrations/chart name.png", "/blog/reference",
    "foo>bar", "reference>path",
  ]) {
    assert.ok(urls.includes(new URL(destination, canonical).href), destination);
  }
  assert.ok(output.includes('[Next](<' + new URL("/blog/next", canonical).href + '> "Next article")'));
  assert.ok(output.includes('[External](https://example.org/article)'));
  assert.equal(output.includes(">bar>)"), false);
  assert.equal(output.includes(">path>"), false);
  for (const snippet of code) assert.ok(output.includes(snippet), snippet);
});

test("Markdown punctuation in article titles stays literal in headings and index labels", () => {
  const title = "[A] *literal* `title` <tag> #1 _test_ \\ value";
  const example = { ...post, title };
  const articleTree = tree(buildArticleMarkdown(example));
  assert.equal(articleTree.children[0].type, "heading");
  assert.equal(toString(articleTree.children[0]), title);
  const index = tree(buildAgentIndex([example]));
  const articleList = index.children.find((node) =>
    node.type === "list" && destinations(node).some((url) => url.endsWith("/blog/example/index.md")),
  );
  assert.equal(toString(articleList.children[0]).startsWith(title + ":"), true);
});

test("all existing article code and diagram blocks survive the complete bundle", async () => {
  const files = (await readdir("content/posts")).filter((file) => file.endsWith(".md"));
  const posts = await Promise.all(files.map(async (file) =>
    parsePost(await readFile(`content/posts/${file}`, "utf8"), file),
  ));
  const full = buildFullAgentContent(posts);
  for (const article of posts.filter((entry) => !entry.draft)) {
    assert.ok(full.includes(`/blog/${article.slug}`));
    if (article.youtubeId) {
      assert.ok(full.includes(`https://www.youtube.com/watch?v=${article.youtubeId}`));
    }
    const originalCode = tree(article.content).children
      .filter((node) => node.type === "code")
      .map((node) => article.content.slice(node.position.start.offset, node.position.end.offset));
    for (const snippet of originalCode) assert.ok(full.includes(snippet), article.slug);
  }
});
