import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import { siteConfig } from "../data/site.ts";
import { parsePost, toPostSummary } from "./post-content.ts";
import {
  baseMetadata,
  blogJsonLd,
  blogPostJsonLd,
  buildPostMetadata,
  personJsonLd,
  profilePageJsonLd,
  serializeJsonLd,
  websiteJsonLd,
} from "./seo.ts";

const posts = await Promise.all(
  (await readdir("content/posts"))
    .filter((file) => file.endsWith(".md"))
    .map(async (file) => parsePost(await readFile(`content/posts/${file}`, "utf8"), file)),
);

test("article metadata and structured data agree with published content and real images", async () => {
  for (const post of posts.filter((post) => !post.draft)) {
    const metadata = buildPostMetadata(post);
    const article = blogPostJsonLd(post);
    const canonical = `${siteConfig.url}/blog/${post.slug}`;
    assert.equal(metadata.alternates.canonical, canonical);
    assert.equal(metadata.openGraph.url, canonical);
    assert.equal(article.url, canonical);
    assert.equal(article.mainEntityOfPage["@id"], canonical);
    assert.equal(article.headline, post.title);
    assert.equal(metadata.description, post.description);
    assert.equal(article.description, post.description);
    assert.equal(article.wordCount, post.wordCount);
    assert.equal(article.datePublished, metadata.openGraph.publishedTime);
    assert.equal(article.dateModified, metadata.openGraph.modifiedTime);
    assert.equal(article.dateModified, new Date(post.updated).toISOString());
    assert.deepEqual(metadata.openGraph.authors, [article.author.url]);
    assert.equal(metadata.twitter.images[0].alt, post.coverAlt);

    const cover = await readFile(`public${post.cover}`);
    const image = metadata.openGraph.images[0];
    assert.ok(cover.length > 0, `${post.slug}: missing social image`);
    assert.equal(image.url, `${siteConfig.url}${post.cover}`);
    assert.equal(article.image.url, image.url);
  }
  // PNG dimensions in IHDR: prevent metadata drifting from the default image.
  const defaultImage = baseMetadata().openGraph.images[0];
  const cover = await readFile(`public${siteConfig.image}`);
  assert.equal(defaultImage.width, cover.readUInt32BE(16));
  assert.equal(defaultImage.height, cover.readUInt32BE(20));
});

test("the site, profile, blog and articles refer to the same author and canonical entities", () => {
  const person = personJsonLd();
  const website = websiteJsonLd();
  const profile = profilePageJsonLd();
  const blog = blogJsonLd(posts.map(toPostSummary), "Blog description");
  assert.equal(website.author["@id"], person["@id"]);
  assert.equal(website.publisher["@id"], person["@id"]);
  assert.equal(profile.mainEntity["@id"], person["@id"]);
  assert.equal(profile.url, person.url);
  assert.equal(profile.isPartOf["@id"], website["@id"]);
  assert.equal(blog.isPartOf["@id"], website["@id"]);
  assert.deepEqual(person.sameAs, Object.values(siteConfig.social));
  assert.ok(!website.potentialAction, "Do not advertise unsupported site search");
  for (const post of posts) {
    const article = blogPostJsonLd(post);
    assert.equal(article.author["@id"], person["@id"]);
    assert.equal(article.publisher["@id"], person["@id"]);
    assert.equal(article.isPartOf["@id"], blog["@id"]);
    assert.ok(blog.blogPost.some((entry) => entry["@id"] === article["@id"]));
  }
});

test("JSON-LD cannot terminate its script element through article text", () => {
  const data = { headline: '</script><script>alert("test")</script>', description: "A & B" };
  const serialized = serializeJsonLd(data);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), data);
});
