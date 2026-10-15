import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getArticleImageSource, getArticleStructure, parseDiagram } from "./article-content.ts";
import {
  parsePost,
  selectRelatedPosts,
  toPostSummary,
} from "./post-content.ts";
import { buildRss, escapeXml } from "./rss.ts";
import { validateAdvancedSeo, validateArticleDates, validateCanonicalUrl, validateSocialImage } from "./blog-seo-validation.ts";

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

test("diagrams accept optional input/output nodes and count their readable text", () => {
  const diagram = {
    title: "Two stages",
    caption: "Read then write",
    steps: [
      { label: "Read", detail: "Get data" },
      { label: "Write", detail: "Save data" },
    ],
  };
  const input = {
    label: "Same held-out requests",
    detail: "Used by both policies",
  };
  const output = {
    label: "Shared scoring",
    detail: "Compare cost and quality",
  };
  for (const layout of ["flow", "comparison"]) {
    for (const [nodes, expectedWords] of [
      [{}, 11],
      [{ input }, 18],
      [{ output }, 17],
      [{ input, output }, 24],
    ]) {
      const data = { ...diagram, layout, ...nodes };
      const source = JSON.stringify(data);
      assert.deepEqual(parseDiagram(source), data);
      const content = `\`\`\`diagram\n${source}\n\`\`\``;
      assert.equal(getArticleStructure(content).wordCount, expectedWords);
      assert.equal(getArticleStructure(content).diagramCount, 1);
      assert.equal(
        getArticleStructure(`\n${"word ".repeat(180)}\n\n${content}`).readingMinutes,
        expectedWords === 24 ? 2 : 1,
      );
    }
  }
});

test("supplied diagram input/output nodes must be objects with nonempty label and detail strings", () => {
  const diagram = {
    title: "Two policies",
    caption: "Compare their outputs",
    layout: "comparison",
    steps: [
      { label: "A", detail: "Router" },
      { label: "B", detail: "Baseline" },
    ],
  };
  for (const key of ["input", "output"]) {
    for (const node of [
      null,
      false,
      42,
      "Request",
      [],
      {},
      { label: "Request" },
      { detail: "Same traffic" },
      { label: " ", detail: "Same traffic" },
      { label: "Request", detail: "" },
      { label: 1, detail: "Same traffic" },
      { label: "Request", detail: null },
    ]) {
      assert.throws(
        () => parseDiagram(JSON.stringify({ ...diagram, [key]: node })),
        new RegExp(`diagram ${key} needs a nonempty label and detail`),
      );
    }
  }
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

test("nested Markdown validates diagram data and H1 headings before rendering", () => {
  for (const content of [
    "> # Duplicate page heading",
    "- # Duplicate page heading",
  ]) {
    assert.throws(() => getArticleStructure(content), /h2/);
    assert.throws(() => parsePost(`${fixture}\n${content}`, "nested.md"), /h2/);
  }
  for (const content of [
    "> ```diagram\n> not json\n> ```",
    "- Diagram:\n\n  ```diagram\n  {}\n  ```",
  ]) {
    assert.throws(() => getArticleStructure(content));
    assert.throws(() => parsePost(`${fixture}\n${content}`, "nested.md"));
  }
});

test("nested headings keep renderer IDs and nested diagrams count their prose once", () => {
  const diagram = { title: "Start", caption: "Result", layout: "flow", steps: [
    { label: "One", detail: "Read" },
    { label: "Two", detail: "Write" },
  ] };
  const content = `## Same\n\n> ## Same\n>\n> Some**thing** stays together.\n>\n> \`\`\`diagram\n> ${JSON.stringify(diagram)}\n> \`\`\`\n\n- First item\n- Second item`;
  const info = getArticleStructure(content);
  const html = renderToStaticMarkup(createElement(ReactMarkdown, { rehypePlugins: [rehypeSlug] }, content));
  const ids = [...html.matchAll(/<h[23] id="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(info.headings.map((heading) => heading.id), ids);
  assert.deepEqual(ids, ["same", "same-1"]);
  assert.equal(info.diagramCount, 1);
  assert.equal(info.wordCount, 15);
});

test("article images accept local assets and HTTPS sources without unsafe URL forms", () => {
  assert.equal(getArticleImageSource("/images/blog/photo.webp"), "/images/blog/photo.webp");
  assert.equal(getArticleImageSource("https://images.example.com/photo.png?size=large"), "https://images.example.com/photo.png?size=large");
  for (const source of [undefined, "", "//images.example.com/photo.png", "/\\images.example.com/photo.png", "https://name:password@example.com/photo.png", "javascript:alert(1)", "data:image/png;base64,abc", "http://example.com/photo.png", "relative.png", "https://example.com/\nimage.png"]) {
    assert.equal(getArticleImageSource(source), null, String(source));
  }
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

test("SEO description and social text overrides are optional, trimmed, and strictly text", () => {
  for (const key of ["seoDescription", "ogTitle", "ogDescription", "ogImageAlt", "twitterTitle", "twitterDescription", "twitterImageAlt"]) {
    assert.equal(examplePost[key], undefined);
    const post = parsePost(fixture.replace("---\n", `---\n${key}: " A useful override "\n`), "example.md");
    assert.equal(post[key], "A useful override");
    assert.equal(toPostSummary(post)[key], "A useful override");
    for (const value of ['""', '" "', "null", "123", "false", "[]"]) {
      assert.throws(() => parsePost(fixture.replace("---\n", `---\n${key}: ${value}\n`), "example.md"), new RegExp(key));
    }
  }
});

test("canonical URLs require absolute HTTPS without credentials, fragments, or embedded whitespace", () => {
  assert.equal(examplePost.canonicalUrl, undefined);
  const url = "https://example.com/articles/example?edition=2";
  assert.equal(parsePost(fixture.replace("---\n", `---\ncanonicalUrl: " ${url} "\n`), "example.md").canonicalUrl, url);
  for (const value of ["", "http://example.com/post", "/blog/example", "//example.com/post", "not a URL", "https:///example.com/post", "https://@example.com/post", "https://user:password@example.com/post", "https://example.com/post#section", "https://example.com/post#", "https://example.com/a b", "https://example.com/a\nb", "https:\\example.com/post", null, 123, false]) {
    assert.throws(() => parsePost(fixture.replace("---\n", `---\ncanonicalUrl: ${JSON.stringify(value)}\n`), "example.md"), /canonicalUrl/, String(value));
  }
});

test("custom social images use local illustrations and require their own alternative text", () => {
  assert.equal(examplePost.ogImage, undefined);
  const withImage = fixture.replace("---\n", '---\nogImage: "/illustrations/social.png"\nogImageAlt: " A distinct social image "\n');
  const post = parsePost(withImage, "example.md");
  assert.equal(post.ogImage, "/illustrations/social.png");
  assert.equal(post.ogImageAlt, "A distinct social image");
  assert.throws(() => parsePost(withImage.replace(/^ogImageAlt:.*\n/m, ""), "example.md"), /ogImageAlt/);
  for (const value of ["", "/illustrations/../private.png", "https://example.com/image.png", "/images/social.png", null, 123, false]) {
    assert.throws(() => parsePost(withImage.replace(/^ogImage:.*$/m, `ogImage: ${JSON.stringify(value)}`), "example.md"), /ogImage/, String(value));
  }
});

test("noindex defaults to false and accepts only explicit booleans", () => {
  assert.equal(examplePost.noindex, false);
  for (const value of [true, false]) {
    assert.equal(parsePost(fixture.replace("---\n", `---\nnoindex: ${value}\n`), "example.md").noindex, value);
  }
  for (const value of [null, "true", "false", "", 0, 1, []]) {
    assert.throws(() => parsePost(fixture.replace("---\n", `---\nnoindex: ${JSON.stringify(value)}\n`), "example.md"), /noindex/);
  }
});

test("client-safe SEO validators reject incomplete preview values using save validation", () => {
  assert.doesNotThrow(() => validateCanonicalUrl("https://example.com/blog?edition=2"));
  for (const value of ["", "https://", "http://example.com", "/blog/example", "https://example.com/#part"]) {
    assert.throws(() => validateCanonicalUrl(value), /canonicalUrl/);
  }
  assert.doesNotThrow(() => validateSocialImage("/illustrations/example.png", "Example image"));
  for (const image of ["", "/other/example.png", "/illustrations/../example.png", "/illustrations/./example.png", "/illustrations//example.png", "/illustrations/\\example.png"]) {
    assert.throws(() => validateSocialImage(image, "Example image"), /ogImage/);
  }
  assert.throws(() => validateSocialImage("/illustrations/example.png", " "), /ogImageAlt/);
  assert.doesNotThrow(() => validateArticleDates("2026-10-10"));
  assert.doesNotThrow(() => validateArticleDates("2026-10-10", "2026-10-11"));
  for (const value of ["", "2026-10", "2026-02-30", "2026-10-10T12:00:00Z"]) {
    assert.throws(() => validateArticleDates(value), /invalid date/);
    assert.throws(() => validateArticleDates("2026-10-10", value), /invalid updated/);
  }
  assert.throws(() => validateArticleDates("2026-10-10", "2026-10-09"), /updated precedes publication/);
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


test("advanced SEO frontmatter keeps optional values typed and rejects invalid values", () => {
  for (const [key, values] of Object.entries({
    nofollow: [true, false], nosnippet: [true, false], maxSnippet: [-1, 0, 150],
    maxVideoPreview: [-1, 0, 20], maxImagePreview: ["none", "standard", "large"],
    twitterCard: ["summary", "summary_large_image"],
  })) {
    assert.equal(examplePost[key], undefined);
    for (const value of values) {
      const parsed = parsePost(fixture.replace("---\n", `---\n${key}: ${JSON.stringify(value)}\n`), "example.md");
      assert.equal(parsed[key], value);
      assert.equal(toPostSummary(parsed)[key], value);
      assert.doesNotThrow(() => validateAdvancedSeo({ [key]: value }));
    }
  }
  const invalid = {
    nofollow: [null, 0, "false"], nosnippet: [null, 1, "true"],
    maxSnippet: [null, "150", true, -2, 1.5, Number.MAX_SAFE_INTEGER + 1],
    maxVideoPreview: [null, "0", false, -2, 2.5],
    maxImagePreview: [null, "", "default", 1], twitterCard: [null, "", "player", true],
  };
  for (const [key, values] of Object.entries(invalid)) {
    for (const value of values) {
      assert.throws(() => parsePost(fixture.replace("---\n", `---\n${key}: ${JSON.stringify(value)}\n`), "example.md"), new RegExp(key));
      assert.throws(() => validateAdvancedSeo({ [key]: value }), new RegExp(key));
    }
  }
  for (const key of ["maxSnippet", "maxVideoPreview"]) {
    for (const value of [NaN, Infinity, -Infinity]) assert.throws(() => validateAdvancedSeo({ [key]: value }), new RegExp(key));
  }
});

test("both social image validators require safe raster paths and matching alternative text", () => {
  for (const key of ["ogImage", "twitterImage"]) {
    for (const extension of ["png", "jpg", "jpeg", "webp", "gif", "PNG"]) {
      const image = `/illustrations/social.${extension}`;
      assert.doesNotThrow(() => validateSocialImage(image, "Alt text", key));
      const post = parsePost(fixture.replace("---\n", `---\n${key}: "${image}"\n${key}Alt: " Social image "\n`), "example.md");
      assert.equal(post[key], image);
      assert.equal(post[`${key}Alt`], "Social image");
    }
    for (const image of ["/illustrations/image.svg", "/illustrations/image.txt", "/illustrations/a.png#one", "/illustrations/a.png?cache=1", "/illustrations/a\u0000.png", "/illustrations/a\nb.png", "/illustrations/../x.png", "/illustrations/\\x.png", "/illustrations/x y.png"]) {
      assert.throws(() => validateSocialImage(image, "Alt text", key), new RegExp(key), image);
    }
    assert.throws(() => validateSocialImage("/illustrations/example.png", " ", key), new RegExp(`${key}Alt`));
  }
});
