import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { readFile, readdir, access } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { parsePost } from "./post-content.ts";

const files = (await readdir("content/posts")).filter((file) =>
  file.endsWith(".md"),
);
const posts = await Promise.all(
  files.map(async (file) =>
    parsePost(await readFile(`content/posts/${file}`, "utf8"), file),
  ),
);

test("the published collection has ten LinkedIn expansions plus the revised rendering article", async () => {
  const published = posts.filter((post) => !post.draft);
  assert.ok(published.filter((post) => post.source).length >= 10);
  assert.ok(
    published.some(
      (post) => post.slug === "different-types-of-website-rendering",
    ),
  );
  assert.equal(
    new Set(published.map((post) => post.cover)).size,
    published.length,
  );
  const slugs = new Set(published.map((post) => post.slug));
  for (const post of published) {
    assert.ok(post.wordCount > 0, `${post.slug}: empty article`);
    assert.ok(
      post.diagramCount >= 1,
      `${post.slug}: missing explanatory diagram`,
    );
    assert.ok(post.headings.length >= 4, `${post.slug}: missing structure`);
    assert.equal(post.draft, false);
    assert.ok(post.coverAlt.length > 30);
    await access(`public${post.cover}`);
    const html = renderToStaticMarkup(
      createElement(
        ReactMarkdown,
        { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] },
        post.content,
      ),
    );
    for (const heading of post.headings)
      assert.ok(
        html.includes(`id="${heading.id}"`),
        `${post.slug}: broken TOC ${heading.id}`,
      );
    for (const match of post.content.matchAll(
      /\]\(\/blog\/([^\s)#]+)(?:#[^)]*)?\)/g,
    ))
      assert.ok(slugs.has(match[1]), `${post.slug}: broken link ${match[1]}`);
  }
});

test("the published token-cost example computes its stated result", () => {
  const article = posts.find((post) => post.slug === "llm-token-costs");
  const snippet = article.content.match(/```javascript\n([\s\S]*?)```/)[1];
  assert.equal(
    runInNewContext(`${snippet}\ncost`, {}, { timeout: 1000 }),
    0.004,
  );
});
