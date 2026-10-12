---
title: "Why input and output tokens cost different amounts"
description: "A practical tour of prefill, decoding, and the costs that hide behind a seemingly simple chat request."
date: "2026-10-10"
category: "Practical AI"
tags: ["LLMs", "Inference", "Cost"]
cover: "/illustrations/articles/llm-token-costs.png"
coverAlt: "Grouped input tokens enter a machine while output tokens leave one at a time."
source: "https://lnkd.in/p/dp4gaEpQ"
takeaway: "Input processing and output generation do different work. Measure prompt length, response length, latency, and cost per successful task together."
---
The same unit appears twice on an LLM pricing page: tokens in, tokens out. It is tempting to assume the computation behind each is identical. My LinkedIn note started with the reason that intuition breaks down: reading a known prompt and producing an unknown continuation are different operations.

The distinction explains part of the pricing pattern. It does not establish a universal price ratio. Providers also make commercial choices about caching, hardware utilization, product tiers, and capacity. An output token is not guaranteed to cost exactly twice, or any other fixed multiple of, an input token.

## First the prompt, then the continuation

In a typical autoregressive transformer request, **prefill** processes the prompt. Since those tokens are already known, their processing can exploit parallel computation, subject to attention dependencies and the implementation. A long prompt still requires real work; “parallel” does not mean “instant.”

**Decoding** produces the continuation step by step. Each newly generated token becomes part of the context for the next. Serving systems can batch requests and use techniques such as speculative decoding, but the ordinary generation dependency remains useful for understanding latency. [NVIDIA's inference guide](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/) explains these phases and their different bottlenecks.

```diagram
{"title":"One request, two kinds of work","layout":"flow","steps":[{"label":"Prefill","detail":"Process the known prompt and prepare reusable attention state."},{"label":"Decode","detail":"Generate a continuation, using earlier tokens to predict later ones."},{"label":"Deliver","detail":"Stream tokens or return the complete result when generation ends."}],"caption":"A quick first token and a quick complete answer are separate measurements."}
```

This gives us two latency questions. How long until the first useful token arrives? And how long until the answer is complete? Streaming improves feedback, but a five-paragraph answer still takes time to finish.

## A simple cost calculation

Suppose an example service charges $1 per million input tokens and $4 per million output tokens. These are deliberately hypothetical prices, not a quote from a provider. A request with 2,000 input tokens and 500 output tokens costs:

```javascript
const inputTokens = 2000;
const outputTokens = 500;
const inputRate = 1;   // hypothetical USD per million
const outputRate = 4;
const cost = (inputTokens * inputRate
  + outputTokens * outputRate) / 1_000_000;
// $0.004 per request under these assumptions
```

Halving the prompt saves $0.001. Halving the output also saves $0.001 in this example, despite removing fewer tokens. The useful optimization depends on actual usage and rates, not token count alone.

Now add a retry. If one attempt fails and a second succeeds with the same usage, this one completed task costs $0.008. A cheaper model that frequently needs repair can be more expensive at the task level than its request price suggests. Tool calls, retrieval, and any separately billed reasoning or cached tokens also belong in a real accounting model.

## The cache is not free memory

A key-value cache stores attention state from previous tokens so generation can reuse it instead of recomputing everything. That saves computation but occupies memory. Longer contexts and more simultaneous requests can increase the pressure. Hugging Face documents several [KV-cache strategies and their tradeoffs](https://huggingface.co/docs/transformers/kv_cache), including offloading and quantization.

This is different from an application's response cache, which stores a completed answer, and from provider prompt caching, which may reuse processing for a repeated prefix. The word “cache” can describe all three while hiding very different invalidation and billing rules.

For application design, I would begin with a stable instruction prefix and a small, relevant context bundle. Repeating a whole document collection in every request is rarely a good default. Retrieval should earn its place by supplying material needed for the question, not by making the prompt look comprehensive.

## Optimize the answer shape before the model

If a screen displays a three-field summary, request those three fields. Asking for an essay and trimming it afterward still pays for generating the essay. Put a reasonable output budget around the task, then verify that truncation does not remove necessary information.

| Observation | Experiment worth running |
| --- | --- |
| Slow first token | Inspect prompt size, queue time, and prefill behavior. |
| Fast start, slow finish | Shorten the required answer and measure generation time. |
| Low request cost, high total spend | Inspect retries, tool loops, and unnecessary calls. |
| Long context with weak answers | Improve context selection and check evidence coverage. |

Do not optimize token count at the expense of clarity. A slightly longer prompt that prevents an expensive failure may be the better choice. Keep the same evaluation cases while testing shorter instructions so improvements remain comparable.

The dashboard I would want has successful tasks, total spend, first-token latency, completion latency, and a breakdown by workflow. Tokens explain the bill. Completed, correct work explains whether the bill was worthwhile.

For the next decision—how much model capability a workflow actually needs—see [choosing an LLM](/blog/choosing-an-llm).
