---
title: "Semantic Caching Explained"
seoTitle: "Semantic Caching Explained"
youtubeId: "o20J-96a9RY"
description: "Semantic caching reuses LLM answers to similar questions. See how it works, how it differs from prompt caching, and where it can go wrong."
date: "2026-10-14"
category: "Practical AI"
tags: ["Semantic Caching", "LLMs", "Caching", "AI Engineering"]
cover: "/illustrations/articles/semantic-caching.png"
coverAlt: "Two differently worded binary-search questions pass an eligibility check and share one saved answer."
takeaway: "Prompt caching reuses input processing. Semantic caching reuses an answer. Check meaning, permissions and freshness before serving it."
---
Three people ask the same question differently. Why generate the same answer three times?

**Semantic caching matches meaning and reuses a saved answer.** A valid hit skips the LLM call.

Day 4 of the AI Engineering Interview Series.

## One answer, three questions

“What is binary search?” “Explain binary search.” “How does binary search work?”

An exact response cache treats these as different keys. A semantic cache can reuse one explanation for all three, provided it fits each request.

```diagram
{"title":"Same topic does not always mean the same request","layout":"comparison","steps":[{"label":"“Explain binary search.”","detail":"A saved explanation may answer this."},{"label":"“Write binary search in Python.”","detail":"Needs code. The explanation alone is not enough."}],"caption":"Reuse an answer only when it satisfies the new request."}
```

## How semantic caching works

1. **Embed:** turn the question into a vector representing its meaning.
2. **Compare:** search cached vectors within the allowed context, using a metric such as cosine similarity.
3. **Decide:** if the match passes your threshold and freshness checks, return the saved answer. Otherwise, call the LLM and cache an eligible new response.

![A question becomes an embedding, then searches the cache. A valid hit returns the saved answer; a miss sends the request to the LLM for a new answer.](/illustrations/articles/semantic-cache-flow.png)

Large caches can use approximate nearest-neighbor search to find candidates. [Redis's guide](https://redis.io/docs/latest/develop/ai/redisvl/user_guide/how_to_guides/llmcache/) shows a working implementation.

## Prompt caching vs semantic caching

**Prompt caching reuses processing for a matching input prefix. The LLM still generates an answer. Semantic caching reuses the answer itself.**

![Prompt caching reuses shared input processing before the LLM generates a new answer. Semantic caching returns an eligible saved answer without running generation again.](/illustrations/articles/caching-comparison.png)

A changed question can still benefit from an unchanged prefix, as [OpenAI documents](https://developers.openai.com/api/docs/guides/prompt-caching). Both techniques can work together. See [Day 3: prompt caching](/blog/prompt-caching-explained).

## What can go wrong?

- **Wrong matches:** a permissive threshold can return the wrong answer; a strict one misses useful hits. Tune on real questions. There is no universal “0.7.”
- **Wrong context:** keep tenants, permissions and conversation context separate. Similar wording does not grant access.
- **Stale answers:** invalidate entries when source data changes. For critical responses, check the source of truth or bypass the cache.
- **Extra overhead:** embeddings and vector search add infrastructure, cost and latency. Measure the full request, including misses.

Use semantic caching for repeated questions with stable answers. Start with correctness; then measure the savings.

Next: [Day 5 — LLM model routing](/blog/llm-model-routing) explains how to choose a model when a request needs a new answer.
