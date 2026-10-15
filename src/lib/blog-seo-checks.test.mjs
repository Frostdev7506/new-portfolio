import assert from "node:assert/strict";
import { test } from "node:test";
import { getBlogSeoChecks } from "./blog-seo-checks.ts";

const site = { url: "https://example.com", name: "Author" };
const metadata = {
  title: "A useful article",
  description: "A clear description of this article.",
  category: "Engineering",
  takeaway: "The key point",
  cover: "/illustrations/cover.png",
  coverAlt: "A flow diagram",
  date: "2026-10-10",
  tags: ["Engineering"],
  draft: false,
};
const document = (content, patch = {}) => ({ slug: "current-article", content, metadata: { ...metadata, ...patch } });
const audit = (content, patch = {}, posts = []) => getBlogSeoChecks(document(content, patch), site, posts);
const check = (result, id) => result.checks.find((item) => item.id === id);

test("checks well-formed content with shared word counts, repeated heading IDs, images and local links", () => {
  const result = audit("## Overview\n\nUseful article content.\n\n### Detail\n\n![Flow](/illustrations/flow.png)\n\n## Overview\n\n[Repeated section](#overview-1) [Other article](/blog/other/).", {}, [{ slug: "other", ...metadata, title: "Different", description: "Different summary" }]);
  assert.equal(check(result, "content").status, "pass");
  assert.equal(check(result, "headings").status, "pass");
  assert.equal(check(result, "images").status, "pass");
  assert.equal(check(result, "links").status, "pass");
  assert.deepEqual(result.headings.map(({ depth, id }) => [depth, id]), [[2, "overview"], [3, "detail"], [2, "overview-1"]]);
  assert.ok(result.wordCount > 5);
});

test("invalid content and diagrams are reported without crashing the SEO UI", () => {
  assert.equal(check(audit("  "), "content").status, "error");
  assert.equal(check(audit("# Duplicate page title\n\nText"), "headings").status, "error");
  const broken = audit('## Diagram\n\n```diagram\n{"steps":[]}\n```');
  assert.equal(check(broken, "content").status, "error");
  assert.equal(check(broken, "search-title").status, "pass");
  assert.deepEqual(broken.headings, [{ depth: 2, text: "Diagram", id: "diagram" }]);
  assert.equal(check(audit("### Starts too deep\n\n##### Skips again"), "headings").status, "warning");
});

test("image checks match discarded renderer sources and distinguish decorative alt warnings", () => {
  for (const source of ["relative.png", "http://example.com/image.png", "//example.com/image.png", "javascript:alert"]) {
    const result = audit(`## Images\n\n![Example](${source})`);
    assert.equal(check(result, "images").status, "error", source);
  }
  assert.equal(check(audit("## Images\n\n![](https://example.com/image.png)"), "images").status, "warning");
  assert.equal(check(audit("## Images\n\n![Descriptive](/illustrations/image.png)"), "images").status, "pass");
});

test("resolved references are audited and explicit missing references are detected without inspecting code", () => {
  const valid = audit("## References\n\n![Image][PIC]\n\n[Article][post]\n\n[PIC]: https://example.com/image.png\n[post]: /blog/current-article#references");
  assert.equal(check(valid, "references").status, "pass");
  assert.equal(check(valid, "images").status, "pass");
  assert.equal(check(valid, "links").status, "pass");
  const invalid = audit("## References\n\n[Missing][unknown] and ![Picture][gone] and [Collapsed][]");
  assert.equal(check(invalid, "references").status, "warning");
  assert.match(check(invalid, "references").detail, /unknown/);
  assert.match(check(invalid, "references").detail, /gone/);
  assert.match(check(invalid, "references").detail, /Collapsed/);
  assert.equal(check(audit("## Examples\n\n`[code][missing]`\n\n```md\n![code][missing]\n```\n\n\\[escaped][missing] [plain text]"), "references").status, "pass");
});

test("local link checks handle relative paths and encoded anchors but skip external targets", () => {
  const good = audit("## Hello world\n\n[Section](#hello%2Dworld) [Top](#article-top) [Self](./current-article) [External](https://other.example/blog/missing) [Other page](/about#bio)");
  assert.equal(check(good, "links").status, "pass");
  for (const href of ["/blog/missing", "/blog/current-article#missing", "https://example.com/blog/missing", "/blog/current-article/%2Fbad", "/blog/%E0%A4%A", "#%E0%A4%A"]) {
    assert.equal(check(audit(`## Links\n\n[Target](${href})`), "links").status, "warning", href);
  }
  const incompleteSite = getBlogSeoChecks(document("## Links\n\n[Target](/blog/missing)"), { ...site, url: "invalid" }, []);
  assert.equal(check(incompleteSite, "links").status, "warning");
});

test("duplicates compare effective overrides and normalized whitespace without matching the current article", () => {
  const posts = [{ slug: "current-article", ...metadata }, { slug: "duplicate", ...metadata, title: "Other visible title", seoTitle: " a useful ARTICLE | author ", seoDescription: "A clear  description of this article." }];
  const duplicate = audit("## Content\n\nText", {}, posts);
  assert.equal(check(duplicate, "unique-title").status, "warning");
  assert.equal(check(duplicate, "unique-description").status, "warning");
  const unique = audit("## Content\n\nText", { seoTitle: "A different search title", seoDescription: "A different search summary" }, posts);
  assert.equal(check(unique, "unique-title").status, "pass");
  assert.equal(check(unique, "unique-description").status, "pass");
});

test("long titles and descriptions are editorial warnings, while SVG fallbacks advise a raster social override", () => {
  const result = audit("## Content\n\nText", { seoTitle: "x".repeat(90), seoDescription: "x".repeat(200), cover: "/illustrations/cover.svg" });
  assert.equal(check(result, "search-title").status, "warning");
  assert.match(check(result, "search-title").detail, /no fixed ranking limit/);
  assert.equal(check(result, "search-description").status, "warning");
  assert.equal(check(result, "social-image").status, "warning");
  assert.equal(check(audit("## Content\n\nText", { cover: "/illustrations/cover.svg", ogImage: "/illustrations/social.jpg" }), "social-image").status, "pass");
});

test("local links distinguish drafts from unknown URLs that may have redirects", () => {
  const posts = [{ slug: "draft-target", ...metadata, draft: true }, { slug: "public-target", ...metadata }];
  const draft = audit("## Links\n\n[Draft](/blog/draft-target)", {}, posts);
  assert.equal(check(draft, "links").status, "warning");
  assert.match(check(draft, "links").detail, /drafts without public pages/);
  const unknown = audit("## Links\n\n[Legacy URL](/blog/old-alias)", {}, posts);
  assert.equal(check(unknown, "links").status, "warning");
  assert.match(check(unknown, "links").detail, /Not found in the local article index/);
  assert.match(check(unknown, "links").detail, /saved URL or redirect/);
  assert.equal(check(audit("## Links\n\n[Public](/blog/public-target)", {}, posts), "links").status, "pass");
  const currentDraft = { slug: "current-article", ...metadata, draft: true };
  assert.equal(check(audit("## Links\n\n[Self](#links)", { draft: false }, [currentDraft]), "links").status, "pass");
});

test("social image checks evaluate separate X images and inherit the Open Graph fallback", () => {
  const twitterSvg = audit("## Content\n\nText", { ogImage: "/illustrations/og.png", twitterImage: "/illustrations/x.svg" });
  assert.equal(check(twitterSvg, "social-image").status, "warning");
  assert.match(check(twitterSvg, "social-image").detail, /^X\/Twitter:/);
  const ogSvg = audit("## Content\n\nText", { ogImage: "/illustrations/og.svg", twitterImage: "/illustrations/x.jpg" });
  assert.match(check(ogSvg, "social-image").detail, /^Open Graph:/);
  const bothSvg = audit("## Content\n\nText", { cover: "/illustrations/cover.svg", twitterImage: " " });
  assert.match(check(bothSvg, "social-image").detail, /^Open Graph and X\/Twitter:/);
  assert.equal(check(audit("## Content\n\nText", { ogImage: "/illustrations/og.webp", twitterImage: "/illustrations/x.png" }), "social-image").status, "pass");
});
