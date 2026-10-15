import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildBlogMetadata,
  isBlogPostInSitemap,
  resolveBlogSeo,
  resolveBlogAppearance,
} from "./blog-seo.ts";
import { serializeJsonLd } from "./seo.ts";

const site = {
  url: "https://example.com/",
  name: "Article Author",
  locale: "en_US",
  language: "en",
};
const post = {
  slug: "example-article",
  title: "The visible article title",
  description: "The visible article summary.",
  cover: "/illustrations/example.png",
  coverAlt: "The article's cover",
  date: "2026-10-10",
  updated: "2026-10-12",
  tags: ["React", "Performance"],
  category: "Web engineering",
  wordCount: 1200,
};

test("default SEO preserves the title template and resolves absolute canonical and social URLs", () => {
  const seo = resolveBlogSeo(post, site);
  const metadata = buildBlogMetadata(post, site);
  assert.equal(metadata.title, post.title);
  assert.equal(seo.title, `${post.title} | ${site.name}`);
  assert.equal(seo.description, post.description);
  assert.equal(seo.permalink, "https://example.com/blog/example-article");
  assert.equal(metadata.alternates.canonical, seo.permalink);
  assert.equal(metadata.alternates.types["application/rss+xml"], "https://example.com/feed.xml");
  assert.deepEqual(seo.social, {
    title: seo.title,
    description: post.description,
    image: "https://example.com/illustrations/example.png",
    imageAlt: post.coverAlt,
  });
  assert.equal(metadata.openGraph.url, seo.permalink);
  assert.equal(metadata.openGraph.siteName, site.name);
  assert.equal(metadata.creator, site.name);
  assert.equal(metadata.publisher, site.name);
  assert.equal(metadata.category, post.category);
  assert.deepEqual(metadata.openGraph.images, metadata.twitter.images);
  assert.equal(metadata.twitter.card, "summary_large_image");
  assert.deepEqual(metadata.robots, { ...seo.robots, googleBot: seo.robots });
});

test("search overrides and social overrides remain independent of visible article content", () => {
  const edited = {
    ...post,
    seoTitle: "Search title",
    seoDescription: "Search summary",
    canonicalUrl: "https://original.example/articles/original",
    ogTitle: "Social title",
    ogDescription: "Social summary",
    ogImage: "https://images.example/share.jpg",
    ogImageAlt: "Social image description",
  };
  const seo = resolveBlogSeo(edited, site);
  const metadata = buildBlogMetadata(edited, site);
  assert.deepEqual(metadata.title, { absolute: edited.seoTitle });
  assert.equal(metadata.description, edited.seoDescription);
  assert.equal(metadata.alternates.canonical, edited.canonicalUrl);
  assert.equal(metadata.openGraph.url, edited.canonicalUrl);
  assert.equal(metadata.openGraph.title, edited.ogTitle);
  assert.equal(metadata.twitter.description, edited.ogDescription);
  assert.deepEqual(metadata.twitter.images, [{ url: edited.ogImage, alt: edited.ogImageAlt }]);
  assert.equal(seo.jsonLd[0].headline, post.title);
  assert.equal(seo.jsonLd[0].description, post.description);
  assert.equal(seo.jsonLd[0].mainEntityOfPage["@id"], edited.canonicalUrl);
  assert.equal(seo.jsonLd[0]["@id"], `${seo.permalink}#article`);
  assert.deepEqual(seo.jsonLd[0].image, {
    "@type": "ImageObject",
    url: "https://example.com/illustrations/example.png",
    description: post.coverAlt,
  });
});

test("unset social fields inherit search overrides and blank previews use article fallbacks", () => {
  const seo = resolveBlogSeo({ ...post, seoTitle: "Custom search title", seoDescription: "Custom description" }, site);
  assert.equal(seo.social.title, "Custom search title");
  assert.equal(seo.social.description, "Custom description");
  assert.deepEqual(resolveBlogSeo({ ...post, seoTitle: " ", seoDescription: "", ogTitle: "", ogDescription: " " }, site), resolveBlogSeo(post, site));
});

test("structured data describes the article, author, dates and breadcrumb trail", () => {
  const seo = resolveBlogSeo(post, site);
  const [article, breadcrumbs] = JSON.parse(serializeJsonLd(seo.jsonLd));
  assert.equal(article["@type"], "BlogPosting");
  assert.equal(article["@context"], "https://schema.org");
  assert.deepEqual(article.author, { "@type": "Person", "@id": "https://example.com/#person", name: site.name, url: "https://example.com/about" });
  assert.deepEqual(article.publisher, article.author);
  assert.deepEqual(article.isPartOf, { "@type": "Blog", "@id": "https://example.com/blog#blog" });
  assert.equal(article.isAccessibleForFree, true);
  assert.equal(article.datePublished, "2026-10-10T00:00:00.000Z");
  assert.equal(article.dateModified, "2026-10-12T00:00:00.000Z");
  assert.equal(article.wordCount, 1200);
  assert.equal(article.articleSection, post.category);
  assert.equal(article.keywords, "React, Performance");
  assert.equal(article.inLanguage, "en");
  assert.equal(breadcrumbs["@type"], "BreadcrumbList");
  assert.deepEqual(breadcrumbs.itemListElement.map(({ position, name, item }) => [position, name, item]), [
    [1, "Home", "https://example.com/"],
    [2, "Blog", "https://example.com/blog"],
    [3, post.title, seo.permalink],
  ]);
});

test("JSON-LD serialization cannot terminate its script and preserves the original text", () => {
  const edited = { ...post, title: '</script><script>alert("x")</script>', description: "a < b & c > d" };
  const jsonLd = resolveBlogSeo(edited, site).jsonLd;
  const serialized = serializeJsonLd(jsonLd);
  assert.ok(!serialized.includes("<"));
  assert.match(serialized, /\\u003c\/script>/);
  assert.deepEqual(JSON.parse(serialized), jsonLd);
});

test("drafts and noindex articles produce noindex while keeping links followable", () => {
  for (const fields of [{ noindex: true }, { draft: true }, { noindex: true, draft: true }]) {
    const edited = { ...post, ...fields };
    assert.equal(resolveBlogSeo(edited, site).robots.index, false);
    const robots = { index: false, follow: true, "max-image-preview": "large" };
    assert.deepEqual(buildBlogMetadata(edited, site).robots, { ...robots, googleBot: robots });
    assert.equal(isBlogPostInSitemap(edited, site), false);
  }
});

test("sitemap includes self-canonical articles after URL normalization and excludes other canonicals", () => {
  assert.equal(isBlogPostInSitemap(post, site), true);
  for (const canonicalUrl of [
    "https://example.com/blog/example-article",
    "https://EXAMPLE.com:443/blog/example-article/",
  ]) {
    assert.equal(isBlogPostInSitemap({ ...post, canonicalUrl }, site), true, canonicalUrl);
  }
  for (const canonicalUrl of [
    "https://original.example/blog/example-article",
    "https://example.com/blog/different-article",
    "https://example.com/blog/example-article?version=original",
    "http://example.com/blog/example-article",
  ]) {
    assert.equal(isBlogPostInSitemap({ ...post, canonicalUrl }, site), false, canonicalUrl);
  }
});


test("X card overrides are independent and otherwise inherit Open Graph settings", () => {
  const edited = { ...post, ogTitle: "OG title", ogDescription: "OG description", ogImage: "/illustrations/og.png", ogImageAlt: "OG image" };
  const inherited = resolveBlogSeo(edited, site);
  assert.deepEqual(inherited.twitter, { ...inherited.social, card: "summary_large_image" });
  const overrides = { ...edited, twitterCard: "summary", twitterTitle: "X title", twitterDescription: "X description", twitterImage: "/illustrations/x.png", twitterImageAlt: "X image" };
  const seo = resolveBlogSeo(overrides, site);
  assert.deepEqual(seo.social, inherited.social);
  assert.deepEqual(seo.twitter, { card: "summary", title: "X title", description: "X description", image: "https://example.com/illustrations/x.png", imageAlt: "X image" });
  assert.deepEqual(buildBlogMetadata(overrides, site).twitter, { card: "summary", title: "X title", description: "X description", images: [{ url: "https://example.com/illustrations/x.png", alt: "X image" }] });
  assert.deepEqual(resolveBlogSeo({ ...edited, twitterTitle: " ", twitterDescription: "", twitterImage: " ", twitterImageAlt: "" }, site).twitter, inherited.twitter);
});

test("appearance can render independently of malformed dates, body, and canonical settings", () => {
  const appearance = resolveBlogAppearance({ ...post, date: "", updated: "invalid", canonicalUrl: "http://" }, site);
  const seo = resolveBlogSeo(post, site);
  assert.deepEqual(appearance, { title: seo.title, description: seo.description, social: seo.social, twitter: seo.twitter });
});

test("robots directives preserve zero and unlimited limits and match the public metadata", () => {
  for (const limit of [-1, 0, 120]) {
    const edited = { ...post, nofollow: true, maxSnippet: limit, maxImagePreview: "standard", maxVideoPreview: limit };
    const seo = resolveBlogSeo(edited, site);
    assert.deepEqual(seo.robots, { index: true, follow: false, "max-video-preview": limit, "max-image-preview": "standard", "max-snippet": limit });
    assert.deepEqual(buildBlogMetadata(edited, site).robots, { ...seo.robots, googleBot: seo.robots });
    assert.equal(seo.robotsContent, `index, nofollow, max-video-preview:${limit}, max-image-preview:standard, max-snippet:${limit}`);
    assert.equal(seo.robots.index, true);
    assert.equal(isBlogPostInSitemap(edited, site), true);
  }
  assert.equal(resolveBlogSeo(post, site).robotsContent, "index, follow, max-image-preview:large");
});

test("nosnippet takes precedence over snippet and video limits without hiding image limits", () => {
  const edited = { ...post, noindex: true, nofollow: true, nosnippet: true, maxSnippet: 150, maxVideoPreview: 30, maxImagePreview: "none" };
  const seo = resolveBlogSeo(edited, site);
  assert.deepEqual(seo.robots, { index: false, follow: false, nosnippet: true, "max-image-preview": "none" });
  assert.equal(seo.robotsContent, "noindex, nofollow, nosnippet, max-image-preview:none");
  assert.deepEqual(buildBlogMetadata(edited, site).robots, { ...seo.robots, googleBot: seo.robots });
  const enabled = resolveBlogSeo({ ...edited, nosnippet: false }, site);
  assert.equal(enabled.robots["max-snippet"], 150);
  assert.equal(enabled.robots["max-video-preview"], 30);
});

test("cover dimensions describe only the cover when social overrides use other images", () => {
  const sized = { ...post, coverWidth: 1200, coverHeight: 630 };
  for (const [fields, ogDimensions, twitterDimensions] of [
    [{}, true, true],
    [{ ogImage: "/illustrations/other.png", ogImageAlt: "Other image" }, false, false],
    [{ twitterImage: "/illustrations/twitter.png", twitterImageAlt: "X image" }, true, false],
    [{ ogImage: "/illustrations/other.png", twitterImage: post.cover }, false, true],
    [{ ogImage: `https://example.com${post.cover}` }, true, true],
  ]) {
    const edited = { ...sized, ...fields };
    const metadata = buildBlogMetadata(edited, site);
    for (const [image, hasDimensions] of [[metadata.openGraph.images[0], ogDimensions], [metadata.twitter.images[0], twitterDimensions]]) {
      assert.equal(image.width, hasDimensions ? 1200 : undefined);
      assert.equal(image.height, hasDimensions ? 630 : undefined);
    }
    assert.deepEqual(resolveBlogSeo(edited, site).jsonLd[0].image, {
      "@type": "ImageObject",
      url: "https://example.com/illustrations/example.png",
      description: post.coverAlt,
      width: 1200,
      height: 630,
    });
  }
  for (const dimensions of [{}, { coverWidth: 1200 }, { coverHeight: 630 }]) {
    const edited = { ...post, ...dimensions };
    for (const image of [buildBlogMetadata(edited, site).openGraph.images[0], resolveBlogSeo(edited, site).jsonLd[0].image]) {
      assert.equal("width" in image, false);
      assert.equal("height" in image, false);
    }
  }
});


test("X creator attribution comes only from the configured Twitter or X profile", () => {
  for (const profile of ["https://twitter.com/frostdev7506", "https://x.com/frostdev7506/", "https://www.x.com/frostdev7506?lang=en"]) {
    const authorSite = { ...site, social: { twitter: profile } };
    assert.equal(resolveBlogAppearance(post, authorSite).twitter.creator, "@frostdev7506");
    assert.equal(resolveBlogSeo(post, authorSite).twitter.creator, "@frostdev7506");
    assert.equal(buildBlogMetadata(post, authorSite).twitter.creator, "@frostdev7506");
  }
  for (const profile of [undefined, "", "not a URL", "https://example.com/frostdev7506", "https://x.com.evil.example/frostdev7506", "https://twitter.com/frostdev7506/status/123", "https://x.com/home", "https://twitter.com/", "https://x.com/invalid-handle", "https://x.com/a_handle_that_is_too_long", "https://user:password@x.com/frostdev7506"]) {
    const authorSite = { ...site, social: { twitter: profile } };
    assert.equal(Object.hasOwn(resolveBlogAppearance(post, authorSite).twitter, "creator"), false, String(profile));
    assert.equal(Object.hasOwn(buildBlogMetadata(post, authorSite).twitter, "creator"), false, String(profile));
  }
  assert.equal(Object.hasOwn(buildBlogMetadata(post, site).twitter, "creator"), false);
});
