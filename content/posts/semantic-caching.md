---
title: "Semantic caching: reuse answers to similar LLM questions"
description: "Learn how semantic caching reuses LLM responses, how it differs from prompt caching, and how to tune matching and avoid stale answers."
date: "2026-10-14"
category: "Practical AI"
tags: ["Semantic Caching", "LLMs", "Caching", "AI Engineering"]
cover: "/illustrations/articles/semantic-caching.png"
coverAlt: "Two differently worded binary-search questions pass an eligibility check and share one saved answer."
takeaway: "Semantic caching can reuse a saved answer when a similar request belongs to the same allowed context. Check eligibility and freshness before treating similarity as a cache hit."
---
“What is binary search?” and “Explain binary search” can use the same explanation. Calling an LLM again for each wording repeats work when you already have a suitable answer.

**Semantic caching stores previous responses and looks them up by meaning.** If a new question is sufficiently similar and the saved response is still appropriate for its context, the application can return that answer without generating it again.

This is Day 4 of the AI Engineering Interview Series, following [prompt caching](/blog/prompt-caching). The difference is what gets reused: a complete answer, rather than only processing for shared input.

> **Watch:** [Semantic caching explained on YouTube](https://www.youtube.com/shorts/o20J-96a9RY).

## One answer, different wording

Imagine a beginner programming assistant. It has already answered:

> What is binary search?

The saved response explains that binary search checks the middle of a sorted search range, keeps the half that could contain the target, and repeats until it finds the target or the range is empty.

Later, another learner asks “Explain binary search.” An exact response cache keyed by the full question would treat the two strings as different. A semantic cache can identify them as candidates for the same answer.

That reuse has a boundary. “Show binary search in Python” needs code, while “Does binary search work on an unsorted list?” asks about a condition. Related vocabulary does not guarantee that the saved explanation satisfies either request.

## How semantic caching works

A typical lookup has three stages:

1. **Embed the request.** An embedding model converts the text into a vector: a numerical representation used to compare meaning. Use the same embedding model for incoming requests and stored entries.
2. **Find an eligible candidate.** Search stored vectors within the right context, then apply a matching threshold. The entry also needs its saved response and metadata, such as source version and expiry.
3. **Reuse or generate.** If the candidate passes the application's checks, return its saved answer. Otherwise, call the LLM and store an eligible new response for later requests.

```diagram
{"title":"A paraphrase can reuse an eligible answer","layout":"flow","steps":[{"label":"New question","detail":"Embed “Explain binary search.”"},{"label":"Check candidate","detail":"Compare meaning, allowed context and freshness."},{"label":"Choose the response","detail":"Valid hit: reuse the answer. Miss: generate a new one."}],"caption":"Similarity proposes a match. The application decides whether the saved response is suitable to serve."}
```

Cosine similarity is one possible comparison metric. Some tools expose distance instead, so their threshold runs in the opposite direction: a smaller distance means a closer match. Follow the chosen implementation's definition. [Redis's semantic-cache guide](https://redis.io/docs/latest/develop/ai/redisvl/user_guide/how_to_guides/llmcache/) documents embedding-based lookup, distance thresholds and entry expiration.

Large collections may benefit from approximate nearest-neighbor search. A vector database can provide that search, but it is a component of the cache, not the whole correctness policy.

## Semantic caching vs prompt caching

| Approach | What must match? | What is reused? |
| --- | --- | --- |
| Exact response caching | The application's exact cache key, including relevant context. | A previously generated answer. |
| Prompt or prefix caching | A compatible, matching input prefix under the provider's rules. | Processing state for that prefix; a fresh answer is still generated. |
| Semantic caching | Similar meaning plus the application's eligibility checks. | A previously generated answer. |

A changed question can still benefit from prompt caching when it follows the same eligible prefix. It does not automatically invalidate all cached input. [OpenAI's prompt caching guide](https://developers.openai.com/api/docs/guides/prompt-caching) explains matching-prefix reuse.

The techniques can work together: try a semantic response lookup first, then use prompt caching on an LLM call when no suitable saved answer exists. [KV caching](/blog/kv-caching) and [prefill versus decode](/blog/prefill-vs-decode) explain the model-side work behind that second path.

## Choose a threshold and protect freshness

There is no universally correct threshold such as 0.7. Build an evaluation set from real questions, including paraphrases that should share an answer and near matches that must not. Adjust the threshold while measuring both incorrect reuse and missed opportunities. A more permissive setting can increase hits while admitting wrong answers.

Match within the right scope. Relevant differences can include conversation history, language, tenant, permissions, model configuration and policy version. For example, two customers asking the same refund question may have different entitlements. Do not allow vector similarity to bypass access control or rely on it to infer permission.

Expire or invalidate entries when the source changes. A time-to-live limits how long an answer remains cached; it does not guarantee that the answer is current before that time expires. [Redis's LangCache API](https://redis.io/docs/latest/develop/ai/context-engine/langcache/api-examples/) supports attribute-filtered lookups and deletion by entry or attributes. For consequential or rapidly changing information, validate against the source of truth or bypass response caching.

## Measure the whole request path

A cache hit can avoid generation, but embedding and lookup still cost time and money. Misses pay that overhead before the LLM call. Measure valid-hit rate, incorrect-answer rate, hit and miss latency, end-to-end tail latency, and total cost on representative traffic. Do not assume a particular latency saving or hit percentage.

For an interview, the concise answer is: **semantic caching reuses answers across similar questions; prompt caching reuses processing across matching prefixes.** The engineering challenge is deciding when a saved answer is still appropriate. Start with repeated, stable questions and prove that reuse preserves correctness before optimizing for more hits.
