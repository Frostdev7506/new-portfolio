---
title: "Prefill vs decode: why an LLM pauses before it replies"
description: "Prefill processes your prompt and produces the first token. Decode generates the rest of the reply. Learn how each stage affects response speed."
date: "2026-10-12"
category: "Practical AI"
tags: ["LLMs", "Inference", "AI Engineering", "Performance"]
cover: "/illustrations/articles/prefill-vs-decode.png"
coverAlt: "A group of prompt tokens passes through prefill before individual reply tokens advance through decode."
takeaway: "Prefill processes the available prompt and produces the first reply token. Decode continues the reply using the KV cache, with different latency and hardware constraints."
---
An AI assistant can take a while to start answering, then write quickly. Another request can start immediately and continue slowly. Calling both experiences “a slow model” hides the part you need to investigate.

For a typical autoregressive transformer, inference has two phases: **prefill** processes the prompt, and **decode** continues the answer. They do different amounts of work and put different pressure on the hardware.

This is Part 2 of the AI Engineering Interview Series. [Part 1 explains the KV cache](/blog/kv-caching) that connects these phases.

> **Watch:** [Prefill vs decode on YouTube](https://www.youtube.com/shorts/5rKn3R9MxU8) · **Discuss:** [The Day 2 LinkedIn post](https://www.linkedin.com/feed/update/urn:li:activity:7515313280635084801/)

## Prefill processes the request you already have

Suppose your request is:

> Reply politely to this email: “Can we meet tomorrow?”

The input includes the instruction and the email, plus any other context supplied to the model. After tokenization, the whole input sequence is available. The model can therefore perform operations across many prompt positions together, instead of waiting for another input token to be generated.

It processes the prompt through its layers and stores keys and values for those positions in the KV cache. The output at the final prompt position provides scores for the next token. The generation procedure selects one, starting the reply. For this example, imagine it selects “Yes.” [NVIDIA's inference guide](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/) describes this division between prompt processing and subsequent generation.

Tokens don't always correspond to whole words. “Yes” and the later reply pieces here illustrate the sequence, rather than claiming a particular tokenizer splits the sentence this way.

## Parallel positions still respect word order

Within each layer, prompt positions can be processed together. A **causal mask** lets each position attend only to itself and earlier positions. Position information preserves order, and later layers depend on earlier layers' outputs. The original [Transformer paper](https://arxiv.org/html/1706.03762v7) explains these constraints: parallel prompt processing doesn't make tokens independent or run every layer simultaneously.

## Decode feeds the new token back in

Once “Yes” appears, another model pass determines what comes next. In ordinary single-token decoding, “Yes” supplies the new position to process. Its attention still consults the earlier context. PyTorch's [Flash-Decoding explanation](https://pytorch.org/blog/flash-decoding/) describes why attention remains necessary during cached generation: a single new query position uses the earlier keys and values.

At each layer, the newest token's keys and values are added to the cache alongside the earlier ones. Hugging Face's [cache explanation](https://huggingface.co/docs/transformers/cache_explanation) describes that update.

For our email, imagine the next selected piece continues the reply toward “tomorrow.” That selection becomes the input to the following step. Keep feeding the selected output back in until the model reaches a stopping condition. The sentence grows through repeated passes; it wasn't already waiting as a finished answer in the cache.

```diagram
{"title":"The next output becomes the next input","layout":"flow","steps":[{"label":"Prefill","detail":"Process the instruction and email; cache their keys and values; select “Yes”."},{"label":"First decode step","detail":"Process “Yes” with the cached context; add its keys and values; select the next token."},{"label":"Continue decoding","detail":"Feed each selected token into the following step until the reply is complete."}],"caption":"The reply becomes “Yes, tomorrow works for me.” The visible words illustrate the flow; actual token boundaries depend on the tokenizer."}
```

The important dependency is between generated tokens: the following step needs the token selected by the previous step. The earlier context remains available through the cache. It isn't thrown away when “Yes” becomes the new input.

## Why the hardware bottleneck changes

Prefill often has enough prompt positions to perform large matrix operations efficiently. Reusing weights across those positions gives the accelerator substantial arithmetic work, so **compute capacity** is often the limiting factor.

During decode, a small batch supplies relatively few new tokens per step. The accelerator still needs model weights and cached context. Moving those values through the memory system can take longer than the arithmetic, making **memory bandwidth** a frequent bottleneck.

These are tendencies, not definitions. Prompt length, batch size, architecture, precision, hardware and serving choices change the result. The [JAX scaling book's inference analysis](https://jax-ml.github.io/scaling-book/inference/) derives how the balance changes with the workload.

Memory bandwidth and memory capacity are also different constraints. Bandwidth concerns how quickly data can be read; capacity concerns how much fits. A growing full-attention KV cache uses more capacity and gives attention more cached data to read. Cache strategies and attention architectures can change that growth.

## Measure the first wait and the later gaps

| Metric | What it tells you |
| --- | --- |
| Time to first token, or TTFT | How long the user waits before the first output arrives. |
| Inter-token latency, or ITL | The gaps between subsequent output tokens. |
| End-to-end latency | How long the complete request takes. |

Prefill contributes to TTFT, but client-observed TTFT also includes network travel, queueing and other processing. Decode affects the later gaps. Check the measurement boundary: some systems record gaps between streamed output events, which can contain multiple tokens. [vLLM's metrics documentation](https://docs.vllm.ai/en/latest/design/metrics/) distinguishes these measurements.

For a practical investigation, compare similar requests while changing one variable. Try a longer prompt with a similarly short answer, then a longer answer with the original prompt. Record the first wait and subsequent gaps separately. That gives you a useful hypothesis to test against server metrics instead of blaming every delay on generation speed.

When explaining this in an interview, connect the mechanism to the symptom: prompt processing helps explain the wait before output; sequential generation helps explain the pace afterwards. [Part 3 covers prompt caching](/blog/prompt-caching), which can reuse work when different requests begin with the same context.
