---
title: "LLM Model Routing Explained"
seoTitle: "LLM Model Routing Explained"
youtubeId: "vXV51kD1LW0"
description: "Learn how LLM model routing works. Compare pre-call routing and cascading, with diagrams and interview tips on answer quality, cost, and latency."
date: "2026-10-15"
category: "Practical AI"
tags: ["LLM Model Routing", "Model Routing", "LLMs", "AI Engineering", "LLM Evaluation"]
cover: "/illustrations/articles/model-routing.png"
coverAlt: "LLM model routing diagram: typo and payment-debugging requests enter one router, which selects a lightweight or capable model."
coverWidth: 1200
coverHeight: 630
takeaway: "Choose models using tested task performance. Compare the whole routing system against a capable baseline, including checks and retries."
---
Fixing a README typo and debugging duplicate payments are different jobs. Sending both to your most expensive LLM can waste money.

**LLM model routing chooses which language model handles a request.** The aim is to meet quality and latency targets at the lowest total cost.

Day 5 of the AI Engineering Interview Series. [Day 4 covered semantic caching](/blog/semantic-caching-explained): reusing an answer. Routing decides which model should generate one.

## How model routing works

A lightweight model may handle the typo. Payment debugging may need a model that performs better on complex code. These are illustrative choices, not benchmark results: test both on your workload.

First filter for required capabilities, such as tools, input type and context size. Then choose among eligible models using evaluated task performance. Price, size and prompt length alone do not tell you which model will succeed.

## Pre-call routing: choose a model

The router examines the request **before answer generation**. A rule or trained classifier selects a model, which produces the answer. [RouteLLM](https://arxiv.org/html/2406.18665v4) studies learned routing using preference data.

![Pre-call routing: a README typo enters a router, which selects one eligible LLM before generating the answer.](/illustrations/articles/model-routing-pre-call.png)

When the route is uncertain, your policy can choose the more capable model. The router's prediction is not proof that the answer will be correct.

## LLM cascading: check and escalate

A common cascade starts with a cheaper model, checks its answer, and calls a more capable model if the check fails. [FrugalGPT](https://arxiv.org/abs/2305.05176) explores this sequential design.

![LLM cascade: check the cheap model’s answer, escalate on failure, then check again and return an answer or stop for review.](/illustrations/articles/model-routing-cascade.png)

For payment debugging, run tests against the proposed fix. If they fail, escalate with the failure details. Check the new result too, and stop after a defined attempt limit.

**A passing check can still miss a bug.** A test covering one payment may pass while a repeated request charges twice. Model-based checks are fallible too, as [AutoMix's noisy-verification discussion](https://arxiv.org/abs/2310.12963) explains. A missed error can escape validation; it does not automatically trigger another call. Detected failures and your retry policy cause extra calls, cost and latency.

## Evaluate quality, cost and latency

Define success before tuning. For coding, use relevant tests plus review. Keep test requests separate from router training and threshold tuning.

```diagram
{"title":"Use the same held-out requests","layout":"comparison","steps":[{"label":"Routing policy","detail":"Choose a model; include any validation and escalation."},{"label":"Capable baseline","detail":"Always use the more capable model for these tasks."}],"caption":"Score both against the same success criteria. The baseline can fail too."}
```

Start with offline evaluation on representative production requests. An online A/B test is a separate step: randomly assign live traffic to policies and compare outcomes.

| Metric | What to include |
| --- | --- |
| Answer quality | Task success overall and by task type; inspect accepted wrong answers. |
| Cost per successful task | Total spend, including routing, checks and failed attempts, divided by successful tasks. Report success rate too. |
| End-to-end latency | Time through routing, generation, validation and retries. Check p95 as well as the average. |

Cheap individual calls do not guarantee a cheaper successful task. Frequent escalation can erase the saving and slow the response.

## Model routing interview answer

“I would route clear cases before generation and consider a bounded cascade where output checks are useful. I would compare the policy with an always-capable baseline on held-out requests, then measure quality, cost per successful task and full-request latency. I would retest after model or traffic changes.”

A hybrid is an option to evaluate, not a universal best design. Use the simplest policy that meets your targets.
