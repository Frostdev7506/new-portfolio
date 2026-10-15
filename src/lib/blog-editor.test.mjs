import assert from "node:assert/strict";
import { after, beforeEach, test } from "node:test";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import matter from "gray-matter";
import {
  assertEditorRequest,
  getEditorDocument,
  getEditorIndex,
  readEditorBody,
  readEditorJson,
  saveEditorDocument,
  uploadEditorImage,
} from "./blog-editor.ts";

const initialEnvironment = process.env.NODE_ENV;
beforeEach(() => { process.env.NODE_ENV = "development"; });
after(() => {
  if (initialEnvironment === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = initialEnvironment;
});

const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII=", "base64");
const fixture = `---
# Preserve this exact source when nothing changed.
title: "Example article"
description: "A small article for testing metadata."
date: 2026-10-10
category: "Web engineering"
tags: ["React", "Performance"]
cover: "/illustrations/example.png"
coverAlt: "Example cover."
takeaway: "Verify article metadata."
customField:
  nested: [one, two]
---
## A useful idea

An example paragraph with **bold**, [a link](https://example.com), and <span>HTML</span>.

| Item | Value |
| --- | --- |
| Test | 42 |

\`\`\`javascript
const example = "Keep exact spacing";
\`\`\`

\`\`\`diagram
{"title":"Example flow","caption":"Preserve this","layout":"flow","steps":[{"label":"Read","detail":"Open"},{"label":"Write","detail":"Save"}]}
\`\`\`
`;

async function withRoot(run) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "blog-editor-"));
  try {
    await fs.mkdir(path.join(root, "content", "posts"), { recursive: true });
    await fs.mkdir(path.join(root, "public", "illustrations"), { recursive: true });
    await fs.writeFile(path.join(root, "content", "posts", "example.md"), fixture);
    await fs.writeFile(path.join(root, "public", "illustrations", "example.png"), png);
    await run(root);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
}

function localRequest(method = "GET", extraHeaders = {}) {
  return new Request("http://localhost:3000/api/dev/blog/example", {
    method,
    headers: { host: "localhost:3000", ...(method === "GET" ? {} : { origin: "http://localhost:3000" }), ...extraHeaders },
  });
}

function imageRequest(bytes = png, filename = "cover.png", mime = "image/png") {
  const form = new FormData();
  form.set("file", new File([bytes], filename, { type: mime }));
  return new Request("http://localhost:3000/api/dev/blog/assets", {
    method: "POST",
    headers: { host: "localhost:3000", origin: "http://localhost:3000" },
    body: form,
  });
}

test("editor reads, writes, uploads and request gates all fail closed outside development", async () => {
  for (const environment of ["production", "test", undefined]) {
    if (environment) process.env.NODE_ENV = environment;
    else delete process.env.NODE_ENV;
    assert.throws(() => assertEditorRequest(localRequest()), { status: 404 });
    await assert.rejects(getEditorDocument("example", "/not-a-real-root"), { status: 404 });
    await assert.rejects(getEditorIndex("/not-a-real-root"), { status: 404 });
    await assert.rejects(saveEditorDocument("example", {}, "/not-a-real-root"), { status: 404 });
    await assert.rejects(uploadEditorImage(imageRequest(), "/not-a-real-root"), { status: 404 });
  }
});

test("requests require a loopback host and mutations require the exact origin", () => {
  assert.doesNotThrow(() => assertEditorRequest(localRequest()));
  assert.doesNotThrow(() => assertEditorRequest(localRequest("PUT"), true));
  for (const host of ["127.0.0.1", "[::1]"]) {
    assert.doesNotThrow(() => assertEditorRequest(new Request(`http://${host}:3000/api/dev/blog`)));
  }
  assert.throws(() => assertEditorRequest(new Request("https://public.example/api/dev/blog")), { status: 403 });
  assert.throws(() => assertEditorRequest(localRequest("GET", { host: "attacker.example" })), { status: 403 });
  assert.throws(() => assertEditorRequest(localRequest("PUT", { origin: "https://attacker.example" }), true), { status: 403 });
  assert.throws(() => assertEditorRequest(localRequest("PUT", { origin: "http://localhost:4000" }), true), { status: 403 });
  assert.throws(() => assertEditorRequest(new Request("http://localhost:3000/api/dev/blog", { method: "PUT" }), true), { status: 403 });
  assert.throws(() => assertEditorRequest(localRequest("GET", { "sec-fetch-site": "cross-site" })), { status: 403 });
});

test("Next's internal URL can differ from the validated browser Host without weakening origin checks", () => {
  const internalUrl = "http://localhost:3000/api/dev/blog/example";
  assert.doesNotThrow(() => assertEditorRequest(new Request(internalUrl, { headers: { host: "127.0.0.1:3000" } })));
  assert.doesNotThrow(() => assertEditorRequest(new Request(internalUrl, {
    method: "PUT", headers: { host: "127.0.0.1:3000", origin: "http://127.0.0.1:3000" },
  }), true));
  assert.throws(() => assertEditorRequest(new Request(internalUrl, {
    method: "PUT", headers: { host: "127.0.0.1:3000", origin: "http://localhost:3000" },
  }), true), { status: 403 });
  for (const host of ["attacker.example", "localhost.attacker.example", "localhost@attacker.example", "localhost:3000/path", "localhost:0", "localhost:65536", "localhost:3000,attacker.example"]) {
    assert.throws(() => assertEditorRequest(new Request(internalUrl, {
      headers: { host, "x-forwarded-host": "localhost:3000" },
    })), { status: 403 }, host);
  }
});

test("index includes drafts and local covers; a no-op keeps every original byte", async () => withRoot(async (root) => {
  const draft = fixture.replace('title: "Example article"', 'draft: true\ntitle: "A draft"');
  await fs.writeFile(path.join(root, "content", "posts", "draft.md"), draft);
  const index = await getEditorIndex(root);
  assert.deepEqual(index.posts, [
    { slug: "draft", title: "A draft", description: "A small article for testing metadata.", seoTitle: undefined, seoDescription: undefined, draft: true },
    { slug: "example", title: "Example article", description: "A small article for testing metadata.", seoTitle: undefined, seoDescription: undefined, draft: false },
  ]);
  assert.deepEqual(index.covers, ["/illustrations/example.png"]);
  assert.deepEqual(index.errors, []);
  const original = await getEditorDocument("example", root);
  assert.equal(original.metadata.date, "2026-10-10");
  assert.equal(original.metadata.updated, undefined);
  for (const key of ["noindex", "nofollow", "nosnippet", "maxSnippet", "maxImagePreview", "maxVideoPreview", "twitterCard", "twitterTitle", "twitterDescription", "twitterImage", "twitterImageAlt"]) {
    assert.equal(Object.hasOwn(original.metadata, key), false, key);
  }
  assert.equal(original.metadata.customField, undefined);
  assert.deepEqual(await saveEditorDocument("example", original, root), original);
  assert.equal(await fs.readFile(path.join(root, "content", "posts", "example.md"), "utf8"), fixture);
}));

test("an unfinished draft does not block valid articles or change any files", async () => withRoot(async (root) => {
  const unfinished = "---\ntitle: Unfinished draft\ndraft: true\n---\nWorking on this.\n";
  const draftPath = path.join(root, "content", "posts", "unfinished.md");
  await fs.writeFile(draftPath, unfinished);
  const index = await getEditorIndex(root);
  assert.deepEqual(index.posts.map((post) => post.slug), ["example"]);
  assert.deepEqual(index.errors, [{ fileName: "unfinished.md", message: "tags must be a nonempty list" }]);
  assert.equal((await getEditorDocument("example", root)).slug, "example");
  assert.equal(await fs.readFile(path.join(root, "content", "posts", "example.md"), "utf8"), fixture);
  assert.equal(await fs.readFile(draftPath, "utf8"), unfinished);
}));

test("every existing article opens and saves without changing its original bytes", async () => withRoot(async (root) => {
  const directory = new URL("../../content/posts/", import.meta.url);
  for (const filename of (await fs.readdir(directory)).filter((file) => file.endsWith(".md"))) {
    const source = await fs.readFile(new URL(filename, directory), "utf8");
    const destination = path.join(root, "content", "posts", filename);
    await fs.writeFile(destination, source);
    const slug = filename.slice(0, -3);
    const document = await getEditorDocument(slug, root);
    assert.deepEqual(await saveEditorDocument(slug, document, root), document, filename);
    assert.equal(await fs.readFile(destination, "utf8"), source, filename);
  }
}));

test("saving edits the full body and known settings while preserving unknown YAML and Markdown", async () => withRoot(async (root) => {
  const original = await getEditorDocument("example", root);
  const payload = {
    ...original,
    content: original.content.replace("An example paragraph", "An edited paragraph"),
    metadata: { ...original.metadata, title: "Changed title", updated: "2026-10-11", seoTitle: "Search title", draft: true },
  };
  const saved = await saveEditorDocument("example", payload, root);
  assert.notEqual(saved.revision, original.revision);
  assert.equal(saved.content, payload.content);
  assert.deepEqual(saved.metadata, payload.metadata);
  const disk = matter(await fs.readFile(path.join(root, "content", "posts", "example.md"), "utf8"));
  assert.deepEqual(disk.data.customField, { nested: ["one", "two"] });
  assert.equal(disk.content, payload.content);
  assert.deepEqual(await getEditorDocument("example", root), saved);
  assert.deepEqual(await saveEditorDocument("example", payload, root), saved);
  assert.deepEqual((await fs.readdir(path.join(root, "content", "posts"))), ["example.md"]);
}));

test("save retry handles the serializer's trailing newline and optional blank fields", async () => withRoot(async (root) => {
  const original = await getEditorDocument("example", root);
  const payload = { ...original, content: "## Changed\n\nBody without trailing newline", metadata: { ...original.metadata, source: "", seoTitle: "" } };
  const saved = await saveEditorDocument("example", payload, root);
  assert.equal(saved.content, `${payload.content}\n`);
  assert.deepEqual(await saveEditorDocument("example", payload, root), saved);
}));

test("SEO overrides and noindex round-trip, normalize, and reset without losing article content", async () => withRoot(async (root) => {
  const original = await getEditorDocument("example", root);
  const fields = {
    seoTitle: "Search title",
    seoDescription: "Search description",
    canonicalUrl: "https://example.com/original?edition=2",
    ogTitle: "Social title",
    ogDescription: "Social description",
    ogImage: "/illustrations/example.png",
    ogImageAlt: "Social image description",
    twitterTitle: "X title",
    twitterDescription: "X description",
    twitterImage: "/illustrations/example.png",
    twitterImageAlt: "X image description",
  };
  const paddedFields = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, ` ${value} `]));
  const saved = await saveEditorDocument("example", {
    ...original,
    metadata: { ...original.metadata, ...paddedFields, noindex: true },
  }, root);
  assert.deepEqual(saved.metadata, { ...original.metadata, ...fields, noindex: true });
  assert.equal(saved.content, original.content);
  assert.deepEqual(await getEditorDocument("example", root), saved);
  const savedSource = await fs.readFile(path.join(root, "content", "posts", "example.md"), "utf8");
  assert.deepEqual(await saveEditorDocument("example", saved, root), saved);
  assert.equal(await fs.readFile(path.join(root, "content", "posts", "example.md"), "utf8"), savedSource);

  const indexEntry = (await getEditorIndex(root)).posts.find((post) => post.slug === "example");
  assert.equal(indexEntry.seoTitle, fields.seoTitle);
  assert.equal(indexEntry.seoDescription, fields.seoDescription);
  assert.equal(indexEntry.description, original.metadata.description);
  const blankFields = Object.fromEntries(Object.keys(fields).map((key) => [key, " "]));
  const reset = await saveEditorDocument("example", { ...saved, metadata: { ...saved.metadata, ...blankFields, noindex: false } }, root);
  assert.deepEqual(reset.metadata, { ...original.metadata, noindex: false });
  const resetData = matter(await fs.readFile(path.join(root, "content", "posts", "example.md"), "utf8")).data;
  for (const key of Object.keys(fields)) assert.equal(Object.hasOwn(resetData, key), false, key);
  assert.equal(resetData.noindex, false);
  assert.deepEqual(resetData.customField, { nested: ["one", "two"] });
  const metadata = { ...reset.metadata };
  delete metadata.noindex;
  const removed = await saveEditorDocument("example", { ...reset, metadata }, root);
  assert.equal(Object.hasOwn(removed.metadata, "noindex"), false);
}));

test("invalid SEO, canonical, robots, and social image settings leave article bytes unchanged", async () => withRoot(async (root) => {
  const original = await getEditorDocument("example", root);
  const invalidFields = [
    ...["seoTitle", "seoDescription", "canonicalUrl", "ogTitle", "ogDescription", "ogImage", "ogImageAlt", "twitterTitle", "twitterDescription", "twitterImage", "twitterImageAlt"].map((key) => ({ [key]: 42 })),
    ...[null, "true", "false", 0, 1].map((noindex) => ({ noindex })),
    ...["/relative", "http://example.com/post", "https://user:password@example.com/post", "https://example.com/post#section", "https://example.com/a\nb"].map((canonicalUrl) => ({ canonicalUrl })),
    { ogImage: "/illustrations/example.png" },
    { ogImage: "/illustrations/example.png", ogImageAlt: " " },
    { ogImage: "https://example.com/image.png", ogImageAlt: "Image" },
    { ogImage: "/illustrations/../private.png", ogImageAlt: "Image" },
    { ogImage: "/illustrations/./example.png", ogImageAlt: "Image" },
    { ogImage: "/illustrations/\\example.png", ogImageAlt: "Image" },
    ...["ogImage", "twitterImage"].flatMap((key) => [
      ...["/illustrations/example.svg", "/illustrations/example.txt", "/illustrations/example.png?v=1", "/illustrations/example.png#image", "/illustrations/a\nb.png"].map((image) => ({ [key]: image, [`${key}Alt`]: "Image" })),
      { [key]: "/illustrations/example.png" },
    ]),
    ...["nofollow", "nosnippet"].flatMap((key) => [null, "true", 0, 1].map((value) => ({ [key]: value }))),
    ...["maxSnippet", "maxVideoPreview"].flatMap((key) => [null, "0", false, -2, 1.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1].map((value) => ({ [key]: value }))),
    { maxImagePreview: "default" }, { maxImagePreview: null },
    { twitterCard: "player" }, { twitterCard: null },
  ];
  for (const metadata of invalidFields) {
    await assert.rejects(saveEditorDocument("example", { ...original, metadata: { ...original.metadata, ...metadata } }, root), { status: 400 }, JSON.stringify(metadata));
  }
  await assert.rejects(saveEditorDocument("example", { ...original, metadata: { ...original.metadata, ogImage: "/illustrations/missing.png", ogImageAlt: "Image" } }, root), { status: 404 });
  await fs.mkdir(path.join(root, "public", "illustrations", "directory.png"));
  await assert.rejects(saveEditorDocument("example", { ...original, metadata: { ...original.metadata, ogImage: "/illustrations/directory.png", ogImageAlt: "Image" } }, root), { status: 400 });
  assert.equal(await fs.readFile(path.join(root, "content", "posts", "example.md"), "utf8"), fixture);
  assert.deepEqual(await fs.readdir(path.join(root, "content", "posts")), ["example.md"]);
}));

test("a body starting with a Markdown thematic break is never parsed as frontmatter", async () => withRoot(async (root) => {
  const original = await getEditorDocument("example", root);
  for (const content of ["---\n\n## Introduction\n\nKeep this paragraph.\n", "---\ntitle: This is body text\n---\n\n## Keep this\n"]) {
    const current = await getEditorDocument("example", root);
    const saved = await saveEditorDocument("example", { ...current, content }, root);
    assert.equal(saved.content, content);
    assert.equal(saved.metadata.title, original.metadata.title);
    assert.equal((await getEditorDocument("example", root)).content, content);
  }
}));

test("invalid metadata, headings, diagrams, covers and oversized saves leave the article untouched", async () => withRoot(async (root) => {
  const original = await getEditorDocument("example", root);
  const badPayloads = [
    { ...original, content: "" },
    { ...original, content: "# Invalid heading" },
    { ...original, content: "> # Invalid nested heading" },
    { ...original, content: "```diagram\n{}\n```" },
    { ...original, content: "> ```diagram\n> not valid JSON\n> ```" },
    { ...original, content: "- A list\n\n  ```diagram\n  {}\n  ```" },
    ...[{ title: "" }, { date: "2026-02-30" }, { updated: "2025-01-01" }, { youtubeId: "invalid" }, { tags: [] }, { draft: "true" }, { source: "https://attacker.example" }, { cover: "/illustrations/../secret" }, { unknownField: "ignored?" }]
      .map((metadata) => ({ ...original, metadata: { ...original.metadata, ...metadata } })),
  ];
  for (const payload of badPayloads) {
    await assert.rejects(saveEditorDocument("example", payload, root), { status: 400 });
  }
  await assert.rejects(saveEditorDocument("example", { ...original, content: "x".repeat(1024 * 1024) }, root), { status: 413 });
  assert.equal(await fs.readFile(path.join(root, "content", "posts", "example.md"), "utf8"), fixture);
  assert.deepEqual(await fs.readdir(path.join(root, "content", "posts")), ["example.md"]);
}));

test("stale or simultaneous saves cannot overwrite a newer article", async () => withRoot(async (root) => {
  const original = await getEditorDocument("example", root);
  const first = { ...original, content: "## First\n\nA first edit.\n" };
  const second = { ...original, content: "## Second\n\nA different edit.\n" };
  const results = await Promise.allSettled([
    saveEditorDocument("example", first, root),
    saveEditorDocument("example", second, root),
  ]);
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
  assert.equal(results.find((result) => result.status === "rejected").reason.status, 409);
  const winner = results.find((result) => result.status === "fulfilled").value;
  const loser = winner.content === first.content ? second : first;
  await assert.rejects(saveEditorDocument("example", loser, root), { status: 409 });
  assert.deepEqual(await getEditorDocument("example", root), winner);
  assert.deepEqual(await saveEditorDocument("example", winner, root), winner);
}));

test("path traversal and symlinked posts, covers and upload directories are rejected", async () => withRoot(async (root) => {
  for (const slug of ["../example", "/example", "example.md", "example/other", "%2e%2e", "EXAMPLE", "x".repeat(161)]) {
    await assert.rejects(getEditorDocument(slug, root), { status: 400 });
  }
  const original = await getEditorDocument("example", root);
  await fs.symlink(path.join(root, "content", "posts", "example.md"), path.join(root, "content", "posts", "linked.md"));
  await assert.rejects(getEditorDocument("linked", root), { status: 400 });
  await assert.rejects(saveEditorDocument("linked", original, root), { status: 400 });
  await fs.symlink(path.join(root, "public", "illustrations", "example.png"), path.join(root, "public", "illustrations", "linked.png"));
  await assert.rejects(saveEditorDocument("example", { ...original, metadata: { ...original.metadata, cover: "/illustrations/linked.png" } }, root), { status: 400 });
  for (const key of ["ogImage", "twitterImage"]) {
    await assert.rejects(saveEditorDocument("example", { ...original, metadata: { ...original.metadata, [key]: "/illustrations/linked.png", [`${key}Alt`]: "Image" } }, root), { status: 400 });
  }
  await fs.symlink(path.join(root, "content"), path.join(root, "public", "illustrations", "blog"));
  await assert.rejects(uploadEditorImage(imageRequest(), root), { status: 400 });
  assert.equal(await fs.readFile(path.join(root, "content", "posts", "example.md"), "utf8"), fixture);
}));

test("JSON and streamed request size validation rejects malformed or oversized input", async () => {
  await assert.rejects(readEditorJson(new Request("http://localhost", { method: "PUT", headers: { "content-type": "text/plain" }, body: "{}" })), { status: 415 });
  await assert.rejects(readEditorJson(new Request("http://localhost", { method: "PUT", headers: { "content-type": "application/json" }, body: "{" })), { status: 400 });
  await assert.rejects(readEditorBody(new Request("http://localhost", { method: "PUT", body: "too much" }), 4), { status: 413 });
  await assert.rejects(readEditorBody(new Request("http://localhost", { method: "PUT", headers: { "content-length": "999" }, body: "x" }), 4), { status: 413 });
  assert.deepEqual(await readEditorJson(new Request("http://localhost", { method: "PUT", headers: { "content-type": "application/json" }, body: '{"ok":true}' })), { ok: true });
});

test("image uploads verify signature, ignore user filenames and reject SVG or oversized images", async () => withRoot(async (root) => {
  const result = await uploadEditorImage(imageRequest(png, "../../unsafe.svg", "image/svg+xml"), root);
  assert.match(result.url, /^\/illustrations\/blog\/[a-f0-9-]+\.png$/);
  assert.deepEqual(await fs.readFile(path.join(root, "public", result.url)), png);
  await assert.rejects(uploadEditorImage(imageRequest(Buffer.from("<svg onload='alert(1)'/>")), root), { status: 400 });
  await assert.rejects(uploadEditorImage(imageRequest(Buffer.alloc(5 * 1024 * 1024 + 1)), root), { status: 413 });
  assert.equal((await fs.readdir(path.join(root, "public", "illustrations", "blog"))).length, 1);
}));


test("advanced robots and X card settings round-trip and can be cleared without adding defaults", async () => withRoot(async (root) => {
  let current = await getEditorDocument("example", root);
  const originalMetadata = current.metadata;
  for (const fields of [
    { nofollow: true, nosnippet: false, maxSnippet: 0, maxImagePreview: "none", maxVideoPreview: -1, twitterCard: "summary" },
    { nofollow: false, nosnippet: true, maxSnippet: -1, maxImagePreview: "standard", maxVideoPreview: 0, twitterCard: "summary_large_image" },
    { nofollow: false, nosnippet: false, maxSnippet: 180, maxImagePreview: "large", maxVideoPreview: 30, twitterCard: "summary_large_image" },
  ]) {
    current = await saveEditorDocument("example", { ...current, metadata: { ...current.metadata, ...fields } }, root);
    assert.deepEqual(current.metadata, { ...originalMetadata, ...fields });
    assert.deepEqual(await getEditorDocument("example", root), current);
    const bytes = await fs.readFile(path.join(root, "content", "posts", "example.md"), "utf8");
    assert.deepEqual(await saveEditorDocument("example", current, root), current);
    assert.equal(await fs.readFile(path.join(root, "content", "posts", "example.md"), "utf8"), bytes);
  }
  const cleared = await saveEditorDocument("example", {
    ...current,
    metadata: { ...current.metadata, nofollow: undefined, nosnippet: undefined, maxSnippet: undefined, maxImagePreview: undefined, maxVideoPreview: undefined, twitterCard: undefined },
  }, root);
  assert.deepEqual(cleared.metadata, originalMetadata);
  const data = matter(await fs.readFile(path.join(root, "content", "posts", "example.md"), "utf8")).data;
  for (const key of ["nofollow", "nosnippet", "maxSnippet", "maxImagePreview", "maxVideoPreview", "twitterCard"]) {
    assert.equal(Object.hasOwn(data, key), false, key);
  }
}));

test("X image saves require existing regular raster assets and keep bytes unchanged on failure", async () => withRoot(async (root) => {
  const original = await getEditorDocument("example", root);
  await fs.mkdir(path.join(root, "public", "illustrations", "directory.png"));
  await fs.writeFile(path.join(root, "public", "illustrations", "example.svg"), "<svg/>");
  await fs.writeFile(path.join(root, "public", "illustrations", "example.txt"), "Not an image");
  for (const [image, status] of [["missing.png", 404], ["directory.png", 400], ["example.svg", 400], ["example.txt", 400]]) {
    for (const key of ["ogImage", "twitterImage"]) {
      await assert.rejects(saveEditorDocument("example", {
        ...original, metadata: { ...original.metadata, [key]: `/illustrations/${image}`, [`${key}Alt`]: "Image" },
      }, root), { status }, key);
    }
  }
  assert.equal(await fs.readFile(path.join(root, "content", "posts", "example.md"), "utf8"), fixture);
}));


test("cover dimensions round-trip, update and clear without dropping other frontmatter", async () => withRoot(async (root) => {
  const original = await getEditorDocument("example", root);
  const saved = await saveEditorDocument("example", {
    ...original, metadata: { ...original.metadata, coverWidth: 1200, coverHeight: 630 },
  }, root);
  assert.equal(saved.metadata.coverWidth, 1200);
  assert.equal(saved.metadata.coverHeight, 630);
  assert.deepEqual(await getEditorDocument("example", root), saved);
  const changed = await saveEditorDocument("example", {
    ...saved, metadata: { ...saved.metadata, coverWidth: 1600, coverHeight: 900 },
  }, root);
  assert.equal(changed.metadata.coverWidth, 1600);
  assert.equal(changed.metadata.coverHeight, 900);
  const cleared = await saveEditorDocument("example", {
    ...changed, metadata: { ...changed.metadata, coverWidth: undefined, coverHeight: undefined },
  }, root);
  assert.equal(Object.hasOwn(cleared.metadata, "coverWidth"), false);
  assert.equal(Object.hasOwn(cleared.metadata, "coverHeight"), false);
  const disk = matter(await fs.readFile(path.join(root, "content", "posts", "example.md"), "utf8"));
  assert.equal(Object.hasOwn(disk.data, "coverWidth"), false);
  assert.equal(Object.hasOwn(disk.data, "coverHeight"), false);
  assert.deepEqual(disk.data.customField, { nested: ["one", "two"] });
  assert.equal(disk.content, original.content);
}));

test("invalid cover dimensions cannot modify the saved file", async () => withRoot(async (root) => {
  const original = await getEditorDocument("example", root);
  for (const dimensions of [
    { coverWidth: 1200 }, { coverHeight: 630 },
    { coverWidth: 0, coverHeight: 630 }, { coverWidth: 1200, coverHeight: -1 },
    { coverWidth: 1200.5, coverHeight: 630 }, { coverWidth: "1200", coverHeight: 630 },
    { coverWidth: null, coverHeight: null }, { coverWidth: Number.MAX_SAFE_INTEGER + 1, coverHeight: 630 },
  ]) {
    await assert.rejects(saveEditorDocument("example", {
      ...original, metadata: { ...original.metadata, ...dimensions },
    }, root), (error) => error.status === 400 && /coverWidth and coverHeight/.test(error.message));
    assert.equal(await fs.readFile(path.join(root, "content", "posts", "example.md"), "utf8"), fixture);
  }
}));
