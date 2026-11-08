import assert from "node:assert/strict";
import { test } from "node:test";
import { getArticleAudioSource } from "./article-content.ts";

test("local and HTTPS-hosted MP3 links can become article players", () => {
  for (const source of [
    "/audio/juno.mp3",
    "/audio/underdog-woof/mira.mp3",
    "https://audio.example.com/juno-underdog-woof.mp3",
  ]) {
    assert.equal(getArticleAudioSource(source), source);
  }
});

test("ordinary links and unsafe audio paths stay outside the player interface", () => {
  for (const source of [
    undefined,
    "",
    "/blog/underdog-woof",
    "http://example.com/audio/juno.mp3",
    "https://user:password@example.com/juno.mp3",
    "https://example.com/juno.mp3?token=expires",
    "https://example.com/juno.mp3#fragment",
    "https://example.com/juno.mp3\n",
    "//example.com/audio/juno.mp3",
    "/audio/../private.mp3",
    "/audio/%2e%2e/private.mp3",
    "/audio/juno.mp3?redirect=elsewhere",
    "/audio/juno.mp3#fragment",
    "/audio/juno.mp3\n",
    "/audio/juno\\mira.mp3",
  ]) {
    assert.equal(getArticleAudioSource(source), null);
  }
});
