---
title: "Choosing an LLM that is good enough for the job"
description: "Turn model selection into a small engineering experiment: define success, compare total cost, and keep an escape hatch."
date: "2026-10-10"
category: "Practical AI"
tags: ["LLMs", "Evaluation", "Cost"]
cover: "/illustrations/articles/choosing-an-llm.png"
coverAlt: "Two inference machines beside a notebook comparing quality, latency, and cost."
source: "https://lnkd.in/p/dAxuqPpm"
takeaway: "Choose the smallest operational commitment that meets a written quality bar. Compare complete workflows, including failures and human review."
---
A model can be impressive and still be a poor fit for a product. It might answer beautifully but take too long for an interactive screen. Another might be inexpensive per request yet need so much repair that the workflow costs more overall.

My LinkedIn post about “good enough, cheap enough, reliable enough” was really a question about fit. What capability does this particular job need, and what will it take to operate it? A leaderboard is useful background. It cannot make that decision for a support queue, a document parser, or a coding assistant with your constraints.

## Write the acceptance criteria first

Consider an illustrative ticket-routing feature. Its job is to assign one of six categories, flag urgent cases, and return a short explanation. It does not need to compose a polished essay or solve unfamiliar research problems.

Before choosing a model, define what a correct result means. The category must exist, the explanation must refer to information in the ticket, and ambiguous requests must have a review path. Urgency mistakes may matter more than a confused category, so an overall accuracy score alone is insufficient.

Build a small evaluation set containing ordinary tickets, unclear tickets, long threads, and requests that contain instructions aimed at the classifier. Keep some cases outside the prompt-tuning loop. Otherwise you can improve the visible score by repeatedly adapting to examples the model has effectively been coached to answer.

```diagram
{"title":"Choose against a task, not a reputation","layout":"flow","steps":[{"label":"Define success","detail":"Write the output contract and unacceptable failure cases."},{"label":"Compare candidates","detail":"Run the same representative inputs under the same constraints."},{"label":"Operate a pilot","detail":"Measure accepted results, review effort, latency, and total spend."}],"caption":"A written acceptance bar makes model changes testable and keeps the decision reversible."}
```

## Compare the whole request path

Use a shared harness that records input, model version, prompt version, result, latency, and checks. Never put private customer examples into a public benchmark artifact. For repeatable academic comparisons, [EleutherAI's evaluation harness](https://github.com/EleutherAI/lm-evaluation-harness) provides established tasks and tooling; a product still needs its own acceptance cases.

A useful comparison table might look like this. These are questions to measure, not claimed results:

| Dimension | Measurement |
| --- | --- |
| Task quality | Correct classifications and high-impact errors, separately |
| Output reliability | Valid schema and allowed category values |
| Speed | Median and tail latency, including retries |
| Economics | Spend per accepted result, including review |
| Operations | Failure recovery, version control, and provider limits |

Keep generation settings and answer length comparable. Allowing one candidate several retries and another only one attempt is a workflow comparison, not a clean model comparison. Both are useful experiments, but label which you are running.

## Open weights and hosted APIs have different bills

An open-weight model provides access to model parameters under its license. That does not mean every component of the training process is available, or that usage is unrestricted. Read the actual license and deployment requirements.

Self-hosting adds capacity planning, updates, monitoring, and idle hardware to the bill. A hosted API moves much of that operation to a provider but introduces external availability, rate limits, version changes, and data-handling constraints. Either can be appropriate; traffic shape and team capacity matter.

A steady, predictable workload may use dedicated hardware efficiently. A low-volume feature with sharp bursts may leave that same hardware idle most of the day. Compare monthly workload scenarios instead of multiplying the cheapest observed token rate by a best-case traffic estimate.

[Token accounting](/blog/llm-token-costs) is a useful starting point, but add retrieval, retries, orchestration, human intervention, and failed tasks. “Cost per accepted result” is often the more revealing number.

## Make escalation observable

Routing routine requests to a smaller model and difficult ones elsewhere can work, but the router creates its own failure mode. How does it know a request is difficult? A model's confident wording is not a reliable signal by itself.

Prefer checks you can inspect: missing evidence, invalid output, an unsupported category, a failed tool call, or a business rule requiring review. Record the reason for escalation and evaluate the combined system. An inexpensive first attempt is wasted spend if nearly every request needs a second attempt anyway.

> **Field note:** Keep one simple baseline. A routing system should beat that baseline on the metrics that matter before earning its extra complexity.

For the ticket example, I would pilot one candidate behind a stable interface, preserve a deterministic fallback, and review a sample of accepted outputs as well as rejected ones. That catches silent errors the validator cannot see.

The decision is not permanent. Save the evaluation set, version the prompt, and rerun it when models or requirements change. A useful model choice is one you can explain today and revisit without rebuilding the product tomorrow.
