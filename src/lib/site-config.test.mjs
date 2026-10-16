import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";

function loadSiteWithUrl(value) {
  const env = { ...process.env };
  if (value === undefined) delete env.NEXT_PUBLIC_SITE_URL;
  else env.NEXT_PUBLIC_SITE_URL = value;
  const source = `
    import { siteConfig } from ${JSON.stringify(new URL("../data/site.ts", import.meta.url).href)};
    import { baseMetadata, buildPageMetadata, personJsonLd, websiteJsonLd } from ${JSON.stringify(new URL("./seo.ts", import.meta.url).href)};
    const page = buildPageMetadata({ title: "Article", description: "Example", path: "/blog/example" });
    console.log(JSON.stringify({
      siteUrl: siteConfig.url,
      metadataBase: baseMetadata().metadataBase.href,
      openGraphUrl: page.openGraph.url,
      websiteUrl: websiteJsonLd().url,
      personUrl: personJsonLd().url,
    }));
  `;
  return JSON.parse(execFileSync(process.execPath, ["--input-type=module", "--eval", source], {
    env,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }));
}

test("site configuration normalizes whitespace and trailing slashes before metadata consumes it", () => {
  const result = loadSiteWithUrl("  https://example.com/// \n");
  assert.deepEqual(result, {
    siteUrl: "https://example.com",
    metadataBase: "https://example.com/",
    openGraphUrl: "https://example.com/blog/example",
    websiteUrl: "https://example.com",
    personUrl: "https://example.com/about",
  });
});

test("unset or blank site configuration uses the production canonical domain", () => {
  for (const value of [undefined, "", " \n "]) {
    const result = loadSiteWithUrl(value);
    assert.equal(result.siteUrl, "https://neerajbutola.in");
    assert.equal(result.openGraphUrl, "https://neerajbutola.in/blog/example");
  }
});
