---
title: "KV caching: how an LLM reuses earlier work"
description: "Follow an email reply token by token to understand what a KV cache stores, how attention reuses it, and why faster generation needs more memory."
date: "2026-10-12"
category: "Practical AI"
tags: ["LLMs", "Inference", "AI Engineering", "Caching"]
cover: "/illustrations/articles/kv-caching.png"
coverAlt: "Earlier key and value blocks are reused during a model step, with new keys and values added as the reply continues."
takeaway: "A KV cache keeps the keys and values of processed tokens, including the prompt. Each new decoding step reuses that context, trading memory for less repeated computation."
---
An LLM has already processed your email. Why should it redo that work every time it adds another piece to its reply? KV caching lets it keep useful intermediate results and reuse them as generation continues.

This is Part 1 of the AI Engineering Interview Series. The important question is what gets reused, because “the model remembers the previous words” leaves out the mechanism.

> **Watch:** [KV caching on YouTube](https://www.youtube.com/shorts/fdulpDUOA_E) · **Discuss:** [The Day 1 LinkedIn post](https://www.linkedin.com/feed/update/urn:li:activity:7515070112203354112/)

## Start with one unfinished reply

Suppose the request is:

> Reply to this email: “Can we meet tomorrow?”

The model processes the prompt and produces a distribution for the first output token. Suppose the selected token represents “Yes”. Real token boundaries depend on the tokenizer; a token can represent a word, part of a word, punctuation or another text fragment.

Next, the model needs to continue from the prompt plus “Yes”. Later, it might finish with “Yes, tomorrow works for me.” Each selected token becomes input for the following generation step.

The initial prompt processing is called **prefill**. The subsequent generation steps are **decode**. NVIDIA’s [inference guide](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/) describes how the prompt’s intermediate results carry forward into decoding. We’ll examine their different performance characteristics in [Part 2: prefill vs decode](/blog/prefill-vs-decode).

## What keys and values contribute

Inside a transformer’s attention layers, token representations are projected into numerical vectors called queries, keys and values. A query is compared with keys to determine attention weights. Those weights are used to combine the values into an attention output. These are learned numerical representations, rather than human-readable labels attached to words.

For our example, processing “Yes” creates a new query that can use information associated with the email. Different layers and attention heads contribute to the resulting representation. The [original Transformer paper](https://arxiv.org/html/1706.03762v7) defines these operations and the causal mask that prevents a position from attending to later positions.

That restriction explains why reuse works. Appending more text doesn’t give earlier positions new future information. With the same model and unchanged preceding context, their earlier keys and values remain usable. A KV cache preserves those results at the attention layers. It isn’t a list of token strings or a stored final answer.

## Keep the earlier results, process the newest token

Without caching, a straightforward generation loop runs the growing sequence through the model again. To continue after “Yes”, that means processing the prompt and “Yes”, including recalculating earlier keys and values.

With caching, prefill has already saved the prompt’s keys and values. The next step processes “Yes”, computes its query, key and value at each attention layer, and uses the earlier cached keys and values alongside the new ones. Its keys and values join the cache for subsequent steps.

Notice the timing: sampling “Yes” doesn’t itself compute its keys and values. They are computed when “Yes” passes through the model as input. Hugging Face’s [cache explanation and generation loop](https://huggingface.co/docs/transformers/cache_explanation) show this sequence explicitly.

```diagram
{"title":"One decoding step with a KV cache","layout":"flow","steps":[{"label":"Keep earlier KV","detail":"The prompt’s processed keys and values remain in memory."},{"label":"Process “Yes”","detail":"Compute new KV and use attention over the cached context."},{"label":"Continue the reply","detail":"Retain the new KV and select the next token to process."}],"caption":"The cache grows as tokens are processed. Earlier attention context still participates in each new step."}
```

Caching therefore removes repeated computation for earlier positions. Attention still calculates how the current position relates to the available context.

## The memory bill grows with the conversation

Keeping those tensors requires memory alongside model weights and other runtime allocations. For a fixed model and cache precision, retaining more token positions generally increases the KV storage requirement. More concurrent sequences need additional cache capacity too. NVIDIA’s [memory discussion](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/) explains why this matters when serving multiple requests.

Consider two workloads: short email replies and long conversations containing several pasted documents. Even with identical model weights, the second workload can require substantially more cache space. A model fitting on a GPU is therefore only the starting point for capacity planning.

Cache implementation changes the details. A dynamic cache can grow during generation, while a static cache reserves capacity ahead of time. Sliding-window attention can bound the retained history in its layers, so unlimited growth isn’t a universal rule. Offloading moves cache data to CPU memory, introducing transfer overhead; cache quantization reduces its precision and brings another performance and accuracy tradeoff. Hugging Face documents these options in its [cache strategies guide](https://huggingface.co/docs/transformers/kv_cache).

Allocation also matters at serving scale. The [PagedAttention research](https://arxiv.org/abs/2309.06180) addresses fragmentation and wasted KV-cache memory through block-based management. That improves how cache space is used; it doesn’t make long contexts free.

## A useful interview answer goes beyond “it is faster”

Explain one step before naming optimizations: the prompt’s KV is already available, the newest token is processed, and its query attends over the relevant keys and values. Then describe the tradeoff: less repeated computation, more retained state.

If asked whether doubling the context doubles latency, don’t infer that from cache size alone. Hardware, batching, attention implementation and memory traffic affect generation speed. A useful evaluation compares the same model and workload while recording generation latency, memory consumption and concurrency.

Next, [prefill vs decode](/blog/prefill-vs-decode) separates the initial prompt processing from the token generation loop. [Part 3: prompt caching](/blog/prompt-caching) builds on this mechanism to explain when processed context can be reused across requests.
