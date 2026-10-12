---
title: "Before adding Redis, draw the request path"
description: "Local memory, shared caches, and databases solve different problems. Start with the time your request actually spends waiting."
date: "2026-10-10"
category: "Systems & scale"
tags: ["System design", "Caching", "Performance"]
cover: "/illustrations/articles/latency-before-scaling.png"
coverAlt: "A short cable reaches a cache drawer while a longer cable leads to a database."
source: "https://www.linkedin.com/feed/update/urn:li:activity:7466126278388228097/"
takeaway: "A network cache still requires a network trip. Choose a cache boundary from freshness, ownership, and measured latency—not from a default stack diagram."
---
I shared [a post by Sameer Bhardwaj](https://www.linkedin.com/feed/update/urn:li:activity:7466101838308745216/) about improving latency by understanding where time goes before buying more RAM. The original observation deserves credit; the examples below are my own worked-through extensions, not a report of a production migration.

The point is not that Redis is unnecessary. A shared cache solves coordination and capacity problems that a local map does not. The point is that every extra boundary deserves a reason. Before adding infrastructure to make a request faster, draw what the request currently does.

## Separate work from waiting

Imagine an API that assembles a public configuration response. It reads the same small database record on every request, transforms it, and sends JSON. A trace might reveal that the database round trip dominates the total time. Or it might reveal that serialization, authentication, or an unrelated downstream call is the expensive part.

These lead to different changes. Caching the database result will do little if another call controls the tail. Start with a span for each major dependency and inspect a distribution, including slow requests. An average can hide the experience of users who repeatedly hit a slow path.

```diagram
{"title":"Choose the boundary you can afford","layout":"comparison","steps":[{"label":"Local memory","detail":"No network hop, but each process owns a separate copy."},{"label":"Shared cache","detail":"One shared service, with network latency and failure modes."},{"label":"Source of truth","detail":"Authoritative state, with the cost of querying and computing it."}],"caption":"The closest copy is useful only when its freshness and ownership rules are correct."}
```

## Ask what makes a cached value valid

For an immutable public configuration revision, an in-process cache can be straightforward. Key by revision, limit memory use, and replace the entry when a new revision is selected. Different processes may hold different revisions briefly if the product allows it.

For a bank balance, permission decision, or rapidly changing inventory quantity, the validity rules are much stricter. A stale hit can be worse than a slow miss. Some values should remain uncached or be validated against authoritative state at the point where correctness matters.

HTTP caching adds another useful boundary. A browser or CDN may serve a public resource without reaching the application at all, provided its cache policy allows it. MDN's [HTTP caching guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) explains freshness, validation, and directives. In particular, `no-cache` means a stored response requires validation before reuse; `no-store` is the directive for avoiding storage.

| Question | Design consequence |
| --- | --- |
| Is the value user-specific? | Include the necessary identity boundary; never share private responses accidentally. |
| How stale may it be? | Define a maximum age or a versioned invalidation strategy. |
| How many distinct keys exist? | Bound memory and decide how eviction works. |
| Must replicas agree immediately? | Local independent copies may be unsuitable. |
| What happens on a cache outage? | Bound fallback traffic to the underlying system. |

## A cache can amplify a failure

Suppose a popular key expires and hundreds of requests arrive together. If every miss independently queries the database, the cache has synchronized a burst of work. A single-flight mechanism can let concurrent requests for the same key share one refresh. Stale-while-refresh behavior may also help when the product permits stale data.

Neither should be added blindly. A stuck refresh needs a timeout; rejected work must release its in-flight entry; a cache needs an upper bound. A local single-flight mechanism protects one process, not all replicas together.

For a small service, the first implementation might simply cache a tiny allowlisted dataset with a short lifetime and no per-user data. That narrow scope makes correctness easier to inspect. Measure hit rate, source load, memory, and end-to-end latency before applying the pattern to every query.

## Scaling changes the economics

An in-process cache duplicates entries across replicas and loses them on restart. That can be acceptable for a small dataset and troublesome for a large one. Serverless lifetimes can also make local reuse unpredictable. A shared cache earns its place when cross-process reuse, centralized invalidation, or the size of the data justifies the extra service.

> **Field note:** Include the cold path in the test. A cache that looks excellent after ten warm requests may still overwhelm its database during deployment.

For the example configuration API, I would compare a versioned local cache with an HTTP cache policy before introducing a shared service. For a cross-worker coordination problem, I would start with the shared-state requirement instead. The same tool can be unnecessary in one request path and essential in another.

The habit to keep is simple: trace the path, name the consistency requirement, then remove the most expensive avoidable work. Sometimes that leads to Redis. Sometimes it leads to one less query.
