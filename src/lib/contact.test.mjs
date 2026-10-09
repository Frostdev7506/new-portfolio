import assert from "node:assert/strict";
import test from "node:test";
import { validateContact, contactMailto } from "./contact.ts";

const valid = {
  name: "Jane Doe",
  email: "jane@example.com",
  message: "I would like to discuss a project.",
};

test("accepts a valid enquiry, including surrounding whitespace", () => {
  assert.deepEqual(validateContact(valid), {});
  assert.deepEqual(
    validateContact({ ...valid, email: " jane@example.com " }),
    {},
  );
});

test("rejects empty, whitespace-only, short and malformed input", () => {
  assert.deepEqual(
    Object.keys(
      validateContact({ name: " ", email: "bad@", message: " short " }),
    ),
    ["name", "email", "message"],
  );
  assert.ok(
    validateContact({
      ...valid,
      email: "jane@example.com\nBcc:other@example.com",
    }).email,
  );
  assert.ok(validateContact({ ...valid, name: "ab" }).name);
  assert.ok(validateContact({ ...valid, message: "123456789" }).message);
  assert.deepEqual(
    validateContact({ ...valid, name: "abc", message: "1234567890" }),
    {},
  );
});

test("email fallback preserves user text without creating extra mail headers", () => {
  const values = {
    ...valid,
    name: "Jane & Co",
    message: "A & B?\n#design = 100%",
  };
  const url = new URL(contactMailto("hello@example.com", values));
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "hello@example.com");
  assert.equal(
    url.searchParams.get("subject"),
    "Website enquiry from Jane & Co",
  );
  assert.equal(
    url.searchParams.get("body"),
    "A & B?\n#design = 100%\n\nFrom: Jane & Co\nReply to: jane@example.com",
  );
  assert.equal([...url.searchParams.keys()].length, 2);
});
