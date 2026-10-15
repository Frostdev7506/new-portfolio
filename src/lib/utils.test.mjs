import assert from "node:assert/strict";
import { test } from "node:test";
import { formatDate } from "./utils.ts";

test("article dates display the same calendar day across server and browser time zones", () => {
  const originalTimeZone = process.env.TZ;
  try {
    for (const timeZone of ["UTC", "America/Los_Angeles", "Pacific/Honolulu", "Asia/Kolkata"]) {
      process.env.TZ = timeZone;
      assert.equal(formatDate("2026-01-01"), "January 1, 2026", timeZone);
      assert.equal(formatDate("2026-10-15"), "October 15, 2026", timeZone);
      assert.equal(formatDate("2024-02-29"), "February 29, 2024", timeZone);
    }
  } finally {
    if (originalTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimeZone;
  }
});

test("invalid or incomplete dates remain safe while editing an article", () => {
  for (const input of ["", "not-a-date", "2026-10-"]) {
    assert.doesNotThrow(() => formatDate(input));
    assert.equal(typeof formatDate(input), "string");
  }
  assert.equal(formatDate(""), "");
  assert.equal(formatDate("not-a-date"), "not-a-date");
});
