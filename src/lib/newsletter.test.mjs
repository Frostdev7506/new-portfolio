import assert from "node:assert/strict";
import test from "node:test";
import { getNewsletterUrl } from "./newsletter.ts";

test("accepts a public HTTPS signup URL and trims configuration whitespace", () => {
  assert.equal(
    getNewsletterUrl(" https://example.kit.com/newsletter?ref=blog "),
    "https://example.kit.com/newsletter?ref=blog",
  );
});

test("keeps email signup disabled for missing or unsafe configuration", () => {
  for (const value of [
    undefined, "", "   ", "not a URL", "/subscribe", "//example.com",
    "http://example.com", "javascript:alert(1)", "mailto:hello@example.com",
    "https://user:password@example.com", "https://user@example.com",
  ]) {
    assert.equal(getNewsletterUrl(value), "", String(value));
  }
});
