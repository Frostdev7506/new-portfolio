---
title: "What rate limits reveal about inference capacity"
description: "Queues, concurrency, and retries explain more about a slow AI feature than a vague claim that the model needs more compute."
date: "2026-10-10"
category: "Systems & scale"
tags: ["Inference", "System design", "Reliability"]
cover: "/illustrations/articles/inference-capacity-and-rate-limits.png"
coverAlt: "Request cards queue before three processing slots and an output page."
source: "https://lnkd.in/p/d5xfE5uM"
takeaway: "Treat inference as a bounded service. Limit concurrency, keep queues finite, and retry only when there is a clear budget and a recoverable failure."
---
A fast model does not guarantee a fast product. A request can spend most of its life waiting for permission to run, waiting in a queue, or retrying work that failed earlier. My LinkedIn thoughts about compute capacity led to a more practical question: what can an application do when demand exceeds the service it depends on?

We cannot infer a provider's internal hardware allocation from one rate-limit response. Limits may reflect a customer's quota, fairness controls, spending policies, or temporary pressure. What we can inspect is our own arrival rate, concurrency, request shape, and retry behavior.

## Put a queue in the picture

Consider an illustrative worker pool with ten slots. If each task occupies a slot for two seconds, a simple upper-bound estimate is five tasks per second, before scheduling and other overhead. Sustained arrivals above that rate make a queue grow unless the system rejects, defers, or reduces work.

Real inference is more complicated because batching, prompt length, output length, and hardware utilization interact. The simple model is still useful: accepting more work does not create more completion capacity.

```diagram
{"title":"Capacity is a budget, not an infinite inbox","layout":"flow","steps":[{"label":"Admit","detail":"Check user quota and the application's concurrency budget."},{"label":"Wait briefly","detail":"Use a bounded queue with a deadline and cancellation."},{"label":"Run","detail":"Spend a worker slot on work the user still needs."},{"label":"Complete","detail":"Record the outcome and release capacity on every path."}],"caption":"When the queue is full, an explicit busy response can be healthier than accepting work that will time out."}
```

Long outputs occupy resources longer. A batch report and a short interactive answer should not necessarily share one undifferentiated queue. Reserving a small amount of capacity for interactive work can protect responsiveness without promising unlimited throughput.

## Choose a deadline before choosing a retry count

Suppose a user-facing request has an eight-second total budget. Spending seven seconds on the first attempt leaves little room for backoff and another call. “Retry three times” ignores the experience the product is supposed to deliver.

Set a total deadline and a per-attempt timeout. Cancel work when the user leaves or the deadline expires where the API supports it, while recognizing that cancellation may not stop already-running server computation. Release local concurrency slots in a `finally` path so failures cannot gradually consume the whole pool.

For transient failures, use bounded exponential backoff with jitter, honor server-provided retry guidance where applicable, and stop when the deadline or attempt budget runs out. AWS explains why synchronized retries can worsen an overloaded dependency in [Timeouts, retries, and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/).

```text
Total deadline = time spent attempting + time spent waiting
Retry only if:
  the failure is recoverable
  the operation is safe to repeat
  another attempt fits the remaining budget
```

Do not retry malformed input, invalid credentials, or a denied permission as if waiting will fix them. Retrying an operation that sends a message or creates a record also requires an idempotency strategy; another generated answer is not the only possible side effect.

## Backpressure needs a user experience

The interface should distinguish “waiting for capacity” from “generating an answer.” A spinner with no explanation makes both look like an unresponsive model. For a background report, show queued status and let the user leave. For an interactive request, offer a concise busy state and a deliberate retry action.

| Work type | Reasonable response to overload |
| --- | --- |
| Short interactive answer | Small queue, short deadline, clear busy response |
| Background document job | Durable job record, longer queue, progress and cancellation |
| Optional suggestion | Skip or defer without blocking the main task |
| Action with side effects | Preserve operation identity and reconcile uncertain results |

Fairness matters too. One user submitting a large batch should not occupy every available slot. Per-user limits, overall limits, and request-size limits serve different purposes. Record which limit fired so support and engineering can explain the behavior.

## Measure the queue separately

At minimum, track queue time, service time, total duration, rejection rate, retries, and completed tasks. Look at the distribution by workflow. An increasing queue with stable service time suggests a different problem from stable arrivals with a sudden jump in model latency.

Add cost to those measurements. A retry storm can simultaneously increase latency and spend. The [token-cost view](/blog/llm-token-costs) becomes much more useful when tied to attempts and completed work.

For a first release, I would prefer a modest concurrency cap, a finite queue, and explicit deadlines. Test a burst above expected capacity and confirm the system recovers after traffic falls. A service that stays understandable under pressure is easier to scale than one that hides overload behind an ever-growing pile of promises.
