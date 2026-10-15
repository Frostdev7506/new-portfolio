---
title: "Prompt Caching Explained"
seoTitle: "Prompt Caching Explained"
youtubeId: "vNJjm7b1QDU"
description: "Learn prompt caching with a support-bot example and interview answers on prefix matching, cache misses, policy updates, latency and cost trade-offs."
date: "2026-10-12"
updated: "2026-10-15"
category: "Practical AI"
tags: ["Prompt Caching", "LLMs", "Caching", "AI Engineering"]
cover: "/illustrations/articles/prompt-caching.png"
coverAlt: "Two requests reuse processing for the same instructions and reference prefix, followed by a different question in each request."
takeaway: "Prompt caching reuses processing for a matching prompt prefix. Keep stable context first, verify cache hits, and remember that every answer still needs generation."
---
Your support assistant receives a different question each time, but you send the same instructions and policy document with every request. Reprocessing that unchanged material is work you may be able to reuse.

**Prompt caching saves reusable processing results for a shared prompt prefix.** When another request starts with matching content and an eligible cache entry is available, the system can reuse those results and process the new material. It still generates an answer for the current question. [OpenAI's prompt caching guide](https://developers.openai.com/api/docs/guides/prompt-caching) describes this as retaining the prefix's key-value state.

This is Part 3 of the AI Engineering Interview Series. [Part 1 covers KV caching](/blog/kv-cache-explained) within generation, and [Part 2 explains prefill and decode](/blog/prefill-vs-decode-explained). Prompt caching connects them across requests.

> **Follow the series:** [Neeraj on LinkedIn](https://www.linkedin.com/in/neeraj-butola/)

## Two customers, the same policy

Imagine a fictional shop with a long support handbook. One rule allows returns of unopened headphones within 30 days with proof of purchase. The assistant also receives instructions to answer from that handbook and ask for missing details.

Two customers send these questions:

```text
Request A
  Shared instructions + full support handbook
  Question: Can I return headphones I opened yesterday?

Request B
  Shared instructions + identical support handbook
  Question: I bought unopened headphones ten days ago.
            What proof of purchase do I need?
```

On the first request, the system processes the shared material and can save its reusable state. On the second, a cache hit lets it reuse the matching beginning. The new question still needs processing against that context, followed by generation.

The answers must differ: one customer asks about an opened product, the other about purchase evidence. Caching the handbook doesn't mean giving both customers the first answer. These short excerpts illustrate the arrangement; an actual provider may require a much longer prefix before caching applies.

```diagram
{"title":"Same handbook, different questions","layout":"flow","steps":[{"label":"First request","detail":"Process the shared instructions and handbook; save eligible prefix state."},{"label":"Matching prefix","detail":"A later request reuses available state for the identical beginning."},{"label":"New answer","detail":"Process the new question using that context, then generate its response."}],"caption":"Only the matching prefix is reused. The second customer's question still gets its own processing and answer."}
```

## Why the beginning has to match

A prefix is the beginning of the model's input, including the relevant instructions and other content preceding the question. Putting the same paragraph somewhere in two requests doesn't guarantee a reusable prefix.

Consider this arrangement:

```text
Timestamp that changes on every request
Shared instructions
Long policy document
Customer question
```

The timestamp introduces a difference before the policy. Move per-request details after the stable context when their meaning and instruction priority allow it. Keep the policy's content and serialization stable too. [Anthropic's caching documentation](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) requires identical prompt segments through the cached boundary and explains how changes to tools or instructions affect reuse.

For the shop, I would assemble the request from a versioned policy file, stable instructions, and a separate customer message. That makes accidental differences easier to find. If the policy changes, send the new version. A missed cache hit is preferable to answering with an outdated rule.

## Where the saved work comes from

During prefill, a transformer builds intermediate state for the prompt. KV caching keeps that state useful as generation continues. Prefix caching extends reuse to another request that starts with compatible, matching content. vLLM documents this mechanism in its [automatic prefix caching guide](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching/).

The new question and generated tokens still use earlier context through attention. Reuse doesn't remove that context or make a long answer free to produce. The main direct saving is in processing the shared input, so a workload dominated by a long output may see a smaller overall improvement.

| Mechanism | What is reused? | Does it generate a fresh answer? |
| --- | --- | --- |
| KV caching during generation | Earlier tokens' attention state | Generation continues token by token. |
| Prompt or prefix caching | State for a matching input prefix | Yes, for the current request. |
| Response caching | A previously produced answer | Usually returns that saved answer. |

The table describes the roles, not three unrelated storage formats. Prompt caching can reuse a KV cache. Keeping the names separate helps identify which work an optimization actually avoids.

## A repeated prompt can still miss

Matching content is necessary for prefix reuse, but availability and provider rules matter too. Check the supported model, minimum prefix length, cache lifetime, and whether your API expects explicit cache controls. Avoid carrying settings from an old tutorial into a different model without checking them.

For example, [Google's context caching guide](https://ai.google.dev/gemini-api/docs/caching) documents model-specific minimum lengths, recommends common content at the beginning, and exposes cached-token usage. This is why a two-line repeated prompt is a poor test of whether a caching integration works.

Build a small experiment with a realistic handbook and three requests: the first writes or warms the cache, the second keeps the prefix identical, and the third changes an early instruction. Compare the reported cache usage. Keep an ordinary successful-response path for misses; cache availability should improve performance without deciding whether the assistant can function.

## Measure the benefit on your workload

For that experiment, record time to first token, total response time, cached input tokens, output length, and billed cost. Repeat it enough to separate a cache effect from network or server variation. Check answer correctness with both customer questions as well.

Track cache creation and reads separately where the provider exposes them. Some services charge differently for writes, reads, or storage. A rarely reused document may offer little benefit after those costs. Use the current provider rates rather than assuming a universal discount. The broader [token cost model](/blog/llm-token-costs) still includes output and uncached input.

## Interview questions and answers

### Why can a timestamp at the start of a prompt destroy cache reuse?

Prefix reuse depends on the sequence from the beginning, not on finding identical paragraphs anywhere in the request. A changing timestamp before the handbook breaks that shared beginning. Put stable instructions and reference material first, then changing details, while preserving instruction priority. Stable tool definitions matter too: [Anthropic documents](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#what-invalidates-the-cache) that changing tools can invalidate subsequent cached content.

### The prefix is identical. Why am I still getting cache misses?

Check eligibility and availability separately. Is the model supported, is the shared prefix long enough, and was a cache entry written at a reusable boundary? Then check expiry and routing. A stored prefix that includes the first customer's question may not match the second request. [OpenAI's guide](https://developers.openai.com/api/docs/guides/prompt-caching) explains model-dependent boundaries. Inspect reported cached tokens instead of inferring a hit from one fast response.

### Does a prompt-cache hit return the same answer as before?

No. It reuses input processing, then generates a response for the current request. The opened-headphones question and the proof-of-purchase question should receive different answers despite sharing the handbook. Even identical complete inputs don't become a response-cache guarantee: generation still runs. To return a saved answer without generation, you need a response cache and separate checks that the answer still fits.

### What happens when the cached policy changes?

Send the new policy, even if that reduces reuse. Content at and after the change needs fresh processing; an eligible unchanged prefix before it may still be reusable. Update explicit cached-context references if your provider uses them. Version the source document and test a question whose answer changed, such as a return window changing from 30 days to 14. Keeping old text to preserve hits creates a correctness bug.

### Why might a high cache-hit rate barely improve total latency?

Prompt caching primarily saves prefill work; it doesn't eliminate decode. In a simplified example, reducing prefill from 200 ms to 100 ms while decode stays at 1,800 ms changes total model time from 2,000 ms to 1,900 ms: a 5% reduction. [vLLM describes this limitation](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching/#limits). Compare first-token latency, full response latency and billed cost separately, including cache writes or storage where charged.

Next, [Day 4: semantic caching](/blog/semantic-caching-explained) explains when differently worded questions can reuse a complete saved answer, and how to prevent incorrect or stale responses.
