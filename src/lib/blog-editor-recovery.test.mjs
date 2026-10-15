import assert from "node:assert/strict";
import { test } from "node:test";
import { removeMatchingRecovery } from "./blog-editor-recovery.ts";

test("clean tabs and stale recovery actions preserve another tab's unsaved edits", () => {
  const copies = new Map([["article", "second tab edits"]]);
  const storage = {
    getItem: (key) => copies.get(key) ?? null,
    removeItem: (key) => copies.delete(key),
  };

  removeMatchingRecovery(storage, "article", null);
  assert.equal(copies.get("article"), "second tab edits");
  removeMatchingRecovery(storage, "article", "first tab edits");
  assert.equal(copies.get("article"), "second tab edits");
  removeMatchingRecovery(storage, "article", "second tab edits");
  assert.equal(copies.has("article"), false);
});
