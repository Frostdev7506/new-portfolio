import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import { siteConfig } from "../data/site.ts";
import { parsePost, toPostSummary } from "./post-content.ts";
import { buildBlogMetadata, resolveBlogSeo } from "./blog-seo.ts";
import {
  baseMetadata,
  blogJsonLd,
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
    const metadata = buildBlogMetadata(post, siteConfig);
    const article = resolveBlogSeo(post, siteConfig).jsonLd[0];
    const canonical = post.canonicalUrl || `${siteConfig.url}/blog/${post.slug}`;
    assert.equal(metadata.alternates.canonical, canonical);
    assert.equal(metadata.openGraph.url, canonical);
    assert.equal(article.url, canonical);
    assert.equal(article.mainEntityOfPage["@id"], canonical);
    assert.equal(article.headline, post.title);
    assert.equal(metadata.description, post.seoDescription || post.description);
    assert.equal(article.description, post.description);
    assert.equal(article.wordCount, post.wordCount);
    assert.equal(article.inLanguage, siteConfig.language);
    assert.equal(metadata.creator, siteConfig.name);
    assert.equal(metadata.publisher, siteConfig.name);
    assert.equal(metadata.category, post.category);
    assert.equal(metadata.openGraph.siteName, siteConfig.name);
    assert.equal(article.datePublished, metadata.openGraph.publishedTime);
    assert.equal(article.dateModified, metadata.openGraph.modifiedTime);
    assert.equal(article.dateModified, new Date(post.updated).toISOString());
    assert.deepEqual(metadata.openGraph.authors, [article.author.url]);
    assert.equal(metadata.openGraph.images[0].alt, post.ogImageAlt || post.coverAlt);
    assert.equal(metadata.twitter.images[0].alt, post.twitterImageAlt || post.ogImageAlt || post.coverAlt);

    const cover = await readFile(`public${post.cover}`);
    const image = metadata.openGraph.images[0];
    const coverUrl = `${siteConfig.url}${post.cover}`;
    assert.ok(cover.length > 0, `${post.slug}: missing social image`);
    assert.equal(image.url, new URL(post.ogImage || post.cover, siteConfig.url).href);
    assert.equal(metadata.twitter.images[0].url, new URL(post.twitterImage || post.ogImage || post.cover, siteConfig.url).href);
    assert.equal(article.image.url, coverUrl);
    assert.equal(article.image.description, post.coverAlt);
    for (const target of [image, metadata.twitter.images[0], article.image]) {
      if (target.url === coverUrl && post.coverWidth !== undefined) {
        assert.equal(target.width, post.coverWidth);
        assert.equal(target.height, post.coverHeight);
        // Existing PNG covers expose their real dimensions in IHDR.
        if (cover.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
          assert.equal(target.width, cover.readUInt32BE(16));
          assert.equal(target.height, cover.readUInt32BE(20));
        }
      } else {
        assert.equal("width" in target, false);
        assert.equal("height" in target, false);
      }
    }
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
    const article = resolveBlogSeo(post, siteConfig).jsonLd[0];
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
