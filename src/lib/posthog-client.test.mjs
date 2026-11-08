import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const source = readFileSync(
  new URL("../../instrumentation-client.ts", import.meta.url),
  "utf8",
).replace('import posthog from "posthog-js";', "");

function initialize(env) {
  const initializations = [];
  const warnings = [];
  runInNewContext(source, {
    process: { env },
    posthog: { init: (...args) => initializations.push(args) },
    console: { warn: (message) => warnings.push(message) },
  });
  return { initializations, warnings };
}

test("missing analytics settings do not block startup", () => {
  for (const NODE_ENV of ["development", "production"]) {
    for (const settings of [
      {},
      { NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: "phc_test" },
      { NEXT_PUBLIC_POSTHOG_HOST: "https://us.i.posthog.com" },
    ]) {
      const { initializations, warnings } = initialize({ NODE_ENV, ...settings });
      assert.equal(initializations.length, 0);
      assert.equal(warnings.length, NODE_ENV === "development" ? 1 : 0);
    }
  }
});

test("complete analytics settings initialize PostHog once", () => {
  for (const NODE_ENV of ["development", "production"]) {
    const { initializations, warnings } = initialize({
      NODE_ENV,
      NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: "phc_test",
      NEXT_PUBLIC_POSTHOG_HOST: "https://us.i.posthog.com",
    });
    assert.equal(initializations.length, 1);
    assert.equal(initializations[0][0], "phc_test");
    assert.equal(initializations[0][1].api_host, "https://us.i.posthog.com");
    assert.equal(initializations[0][1].debug, NODE_ENV === "development");
    assert.equal(warnings.length, 0);
  }
});
