import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import { parsePost } from "../src/lib/post-content.ts";
import { resolveBlogSeo, isBlogPostInSitemap } from "../src/lib/blog-seo.ts";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const { siteConfig } = await import("../src/data/site.ts");

// Run after npm run build. A fresh production server must fail closed even on localhost.
const portReservation = createServer();
await new Promise((resolve) => portReservation.listen(0, "127.0.0.1", resolve));
const port = portReservation.address().port;
await new Promise((resolve) => portReservation.close(resolve));
const base = `http://127.0.0.1:${port}`;
const files = (await readdir("content/posts")).filter((name) => name.endsWith(".md"));
async function contentHashes() {
  return Promise.all(files.map(async (file) => [file, createHash("sha256").update(await readFile(`content/posts/${file}`)).digest("hex")]));
}
const before = await contentHashes();
const assetsBefore = await readdir("public/illustrations", { recursive: true });
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  env: { ...process.env, NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1" },
  stdio: ["ignore", "pipe", "pipe"],
});
let logs = "";
server.stdout.on("data", (chunk) => { logs += chunk; });
server.stderr.on("data", (chunk) => { logs += chunk; });
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(`Production server exited.\n${logs}`);
    try {
      ready = (await fetch(`${base}/api/hello`, { signal: AbortSignal.timeout(1000) })).ok;
    } catch { /* Wait for the local server to listen. */ }
    if (ready) break;
    await delay(100);
  }
  assert.ok(ready, `Production server did not start. Build first.\n${logs}`);
  for (const [method, pathname, body] of [
    ["GET", "/dev/blog"],
    ["GET", "/dev/blog?article=prompt-caching-explained"],
    ["GET", "/api/dev/blog"],
    ["GET", "/api/dev/blog/prompt-caching-explained"],
    ["PUT", "/api/dev/blog/prompt-caching-explained", "{}"],
    ["POST", "/api/dev/blog/assets", "image"],
  ]) {
    const response = await fetch(`${base}${pathname}`, {
      method, body,
      headers: { Origin: base, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    assert.equal(response.status, 404, `${method} ${pathname} must be disabled in production`);
    console.log(`PASS ${method} ${pathname}: 404`);
  }
  for (const pathname of ["/", "/blog", "/blog/prompt-caching-explained"]) {
    const response = await fetch(`${base}${pathname}`, { signal: AbortSignal.timeout(5000) });
    assert.equal(response.status, 200, `${pathname} should still render`);
    const html = await response.text();
    assert.doesNotMatch(html, /\/dev\/blog|Open Blog Studio|Edit article/, "Production pages must not expose editor links");
    console.log(`PASS ${pathname}: public page without editor links`);
  }
  const escapeHtml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  let checked = 0;
  for (const file of files) {
    const article = parsePost(await readFile(`content/posts/${file}`, "utf8"), file);
    const seo = resolveBlogSeo(article, siteConfig);
    const response = await fetch(`${base}/blog/${article.slug}`, { signal: AbortSignal.timeout(5000) });
    assert.equal(response.status, article.draft ? 404 : 200, `${article.slug}: public visibility`);
    assert.equal(sitemap.includes(`<loc>${escapeHtml(seo.permalink)}</loc>`), isBlogPostInSitemap(article, siteConfig), `${article.slug}: sitemap inclusion`);
    if (article.draft) continue;
    const html = await response.text();
    assert.ok(html.includes(`<title>${escapeHtml(seo.title)}</title>`), `${article.slug}: search title`);
    for (const [attribute, name, value] of [
      ["name", "description", seo.description],
      ["name", "robots", seo.robotsContent],
      ["name", "googlebot", seo.robotsContent],
      ["name", "creator", siteConfig.name],
      ["name", "publisher", siteConfig.name],
      ["name", "category", article.category],
      ["property", "og:title", seo.social.title],
      ["property", "og:description", seo.social.description],
      ["property", "og:url", seo.canonicalUrl],
      ["property", "og:site_name", siteConfig.name],
      ["property", "og:image", seo.social.image],
      ["property", "og:image:alt", seo.social.imageAlt],
      ["name", "twitter:card", seo.twitter.card],
      ["name", "twitter:title", seo.twitter.title],
      ["name", "twitter:description", seo.twitter.description],
      ["name", "twitter:image", seo.twitter.image],
      ["name", "twitter:image:alt", seo.twitter.imageAlt],
      ...(seo.twitter.creator ? [["name", "twitter:creator", seo.twitter.creator]] : []),
    ]) {
      assert.ok(html.includes(`<meta ${attribute}="${name}" content="${escapeHtml(value)}"`), `${article.slug}: ${name} must match the editor output`);
    }
    const socialUsesCover = seo.social.image === new URL(article.cover, siteConfig.url).href;
    for (const [dimension, value] of [["width", article.coverWidth], ["height", article.coverHeight]]) {
      if (socialUsesCover && value !== undefined) {
        assert.ok(html.includes(`<meta property="og:image:${dimension}" content="${value}"`), `${article.slug}: cover ${dimension}`);
      } else {
        assert.ok(!html.includes(`<meta property="og:image:${dimension}"`), `${article.slug}: do not assign cover dimensions to another image`);
      }
    }
    assert.ok(html.includes(`<link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}"`), `${article.slug}: canonical URL`);
    const structuredData = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((match) => JSON.parse(match[1]));
    for (const expected of seo.jsonLd) {
      assert.deepEqual(structuredData.find((item) => item["@type"] === expected["@type"]), expected, `${article.slug}: ${expected["@type"]}`);
    }
    assert.doesNotMatch(html, /\/dev\/blog|Open Blog Studio|Edit article/, `${article.slug}: no editor links`);
    checked++;
  }
  console.log(`PASS ${checked} public articles: exact search/social metadata, robots, canonical, JSON-LD, and sitemap parity`);
  assert.deepEqual(await contentHashes(), before, "Production requests must not change content");
  assert.deepEqual(await readdir("public/illustrations", { recursive: true }), assetsBefore, "Production requests must not create uploads");
  console.log("PASS content and assets unchanged");
} finally {
  server.kill("SIGTERM");
  if (server.exitCode === null) await new Promise((resolve) => server.once("exit", resolve));
}
