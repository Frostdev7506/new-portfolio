---
title: "Choosing how your website renders"
description: "CSR, SSR, static generation, and hybrid pages explained through the work they move between the server, browser, and build."
date: "2023-08-01"
updated: "2026-10-10"
category: "Web engineering"
tags: ["React", "Rendering", "Performance"]
cover: "/illustrations/web-rendering.png"
coverAlt: "A browser, static page, and server connected by teal cables in a notebook sketch."
takeaway: "Choose rendering per route and per interaction. Public content benefits from useful HTML early; personal and interactive features can fetch or hydrate where needed."
---
Rendering labels are easy to memorize and harder to use. A product page, an account dashboard, and a blog article may live in one application while needing very different approaches. Choosing one strategy for the entire website can create work that individual routes never needed.

The useful question is where and when the page's initial HTML is produced. A second question follows: how much JavaScript must the browser run before the person can read and use it? Those questions are related, but they are not identical.

## Client-side rendering

With client-side rendering, the browser receives a document that may contain little of the route's actual content, loads JavaScript, fetches data, and constructs the interface. This can work well for rich authenticated applications with frequent interactions after the initial load.

The tradeoff is the startup sequence. If meaningful content depends on downloading JavaScript and then fetching data, the user waits through those dependencies. Loading states help communicate progress but do not remove the work. A powerful development machine can hide this cost, so test with realistic network and device constraints.

A private analytics dashboard is a plausible candidate. Its personalized data changes frequently, and search indexing is usually irrelevant. Even there, a server-rendered shell or initial data can improve first load; “dashboard” does not automatically mean every pixel should be generated in the browser.

## Server-side rendering

With server-side rendering, the server generates HTML for a request. That HTML can include meaningful content before client JavaScript finishes loading. The server may need to query data, check authentication, or call other services, which contributes to response time.

The browser may then hydrate interactive components: it connects client behavior to the existing HTML. Hydration is not the same as generating the initial content, and a server-rendered page can still ship too much JavaScript. Useful HTML arriving early does not guarantee that every control is immediately ready.

A personalized account page can benefit from request-time rendering when the first response needs current user data. Be careful with shared caching: private responses must not be served to another user. Rendering strategy and cache policy should be designed together.

```diagram
{"title":"Where does the first useful page come from?","layout":"comparison","steps":[{"label":"Browser","detail":"CSR constructs the route after client code and required data arrive."},{"label":"Request","detail":"SSR prepares HTML while handling the incoming request."},{"label":"Ahead of time","detail":"Static generation prepares reusable HTML before a visitor asks."}],"caption":"All three can include interactive JavaScript. The distinction is when the initial content is produced."}
```

## Static generation and revalidation

Static generation produces pages ahead of requests, commonly during a build. The resulting HTML can be served repeatedly through a CDN. A blog article is a natural fit: many visitors read the same content, and it changes much less often than it is requested.

Content freshness then becomes a publishing concern. A rebuild can update the site, or a framework can regenerate or revalidate selected content. The exact mechanisms vary, so check your framework's behavior rather than assuming “static” means either permanently frozen or instantly refreshed.

For this notebook, articles live in Markdown and their routes are generated during the build. Editing a file updates the development preview; the deployed static pages need a new deployment to reflect that edit. That is a simple publishing model with a clear freshness boundary.

The [web.dev rendering guide](https://web.dev/articles/rendering-on-the-web) explains the wider tradeoffs among rendering approaches, including hydration and the cost of client-side work.

## Most useful applications are hybrids

A product page can render its description and images ahead of time, fetch current stock through a controlled path, and use client state for the cart. A blog can serve article HTML statically while search filters and copy buttons run in the browser. There is no requirement to make the entire route share one level of interactivity.

| Route or feature | Starting point to consider |
| --- | --- |
| Public article | Static HTML with small interactive components |
| Personalized account summary | Request-time data with appropriate private caching |
| Complex editing workspace | Client interactions, possibly with an initial server-rendered shell |
| Frequently updated public catalogue | Cached or revalidated HTML with an explicit freshness policy |

These are starting points, not universal prescriptions. Constraints such as hosting, data access, publishing frequency, and team familiarity may change the decision. A small, understandable implementation often beats a sophisticated architecture that nobody can explain during an outage.

## Measure the page people actually receive

Inspect the initial HTML and the request waterfall. How soon does useful content appear? Which data requests block it? How much JavaScript ships, and when do the controls become responsive? Check the experience on a slower device, including navigation after the first page load.

Do not reduce the choice to “SSR is good for SEO.” Useful crawlable content, correct metadata, valid links, and appropriate response codes all matter. Server output helps make content available, but it does not repair weak content or broken navigation.

> **Field note:** Set freshness and privacy requirements before tuning cache duration. A fast response containing the wrong user's data is not a successful optimization.

For a new route, write down who sees it, how frequently its data changes, and which parts need interaction. Then choose the simplest rendering and caching arrangement that satisfies those requirements. Revisit it when measurements reveal a bottleneck, rather than migrating everything because a new acronym became popular.

The same reasoning applies at a smaller scale in [optimistic uploads](/blog/optimistic-uploads): decide which work can happen earlier, then preserve the correctness of the final user action.
