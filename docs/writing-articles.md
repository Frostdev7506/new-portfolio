# Writing in the notebook

Articles live in `content/posts/<slug>.md`. The filename becomes `/blog/<slug>`. The index, RSS feed, sitemap, metadata, reading time, and related articles derive from these files.

## Required frontmatter

```yaml
---
title: "A useful, specific title"
description: "A short description of the question the article answers."
date: "2026-10-10"
updated: "2026-10-10" # optional; preserve the original publication date
category: "Web engineering"
tags: ["React", "Performance"]
cover: "/illustrations/articles/article-slug.png"
coverAlt: "Describe the meaningful idea in the illustration."
takeaway: "The central idea a reader should remember."
source: "https://www.linkedin.com/feed/update/.../" # optional original post
draft: false # true omits the article from public routes, index, feed, sitemap
---
```

The parser rejects missing metadata, invalid dates, external cover paths, h1 body headings, and malformed diagrams. Use existing categories where they fit: Web engineering, Practical AI, Systems & scale, Security. Search matches the title, description, and tags; it combines with the topic filter. Related articles use shared tags and category, with deterministic date/slug ordering.

The page supplies h1. Start sections at h2 and use h3 for subtopics. Reading time is computed from article text and diagram labels at 200 words/minute. Do not add a manual estimate. Heading links and the contents use matching slug generation, including repeated headings.

## Rich content

Standard GFM tables, lists, blockquotes, links, and fenced code work. Specify a code language for highlighting and copying. Use a blockquote with a bold “Field note” label for a short practical aside. Raw HTML is not enabled.

Use a `diagram` code fence containing JSON for an accessible, responsive content diagram:

````markdown
```diagram
{"title":"A clear relationship","layout":"flow","steps":[{"label":"Read","detail":"Collect the needed evidence."},{"label":"Check","detail":"Compare the result with the requirement."}],"caption":"Explain what the relationship means, including its limits."}
```
````

`layout` is `flow` (connected steps) or `comparison` (parallel alternatives). Use 2–5 concise steps. Prefer 3 or 4 for readability. The renderer uses real text and semantic figure/list markup, so diagrams remain readable on phones and with assistive technology. For a relationship that cannot be explained accurately by this structure, extend the renderer deliberately instead of forcing unrelated steps into a sequence.

## Content and images

Use a unique local cover that follows `docs/illustrations.md`. The ten new cover briefs and output locations are in `docs/article-illustrations.json`. Their transparent PNG originals stay in `public/illustrations/articles`; Next Image serves responsive AVIF/WebP variants. The existing rendering illustration is reused for the revised rendering article. Do not reuse one stock diagram or cover for unrelated subjects.

Each LinkedIn expansion links to its original post, makes a complete argument, includes a concrete example, and cites relevant primary documentation. Worked figures are explicitly hypothetical. Avoid turning short-post opinions into benchmark claims or inventing personal production experience. The caching article credits Sameer Bhardwaj's original observation. The security article is an evergreen explanation, not a current incident bulletin.

All ten expansions were written on October 10, 2026; that is their publication date, separate from the original LinkedIn post dates. The original rendering article retains August 1, 2023 and shows its revision date. The two former sample-post URLs redirect to the blog index.

## Validate before publishing

Run `npm test`, `npm run lint`, and `npm run build`. The content checks cover metadata, original links, unique local covers, diagrams, internal article links, heading IDs, reading-time calculation, related content, and escaped RSS output. A length check catches accidental stub publication; it does not replace editorial review.

Review the index and changed articles at desktop and phone widths, including dark mode, TOC navigation, overflow, images, and any interactive code examples. Set `NEXT_PUBLIC_SITE_URL` to the deployment's public origin so canonical/share URLs, RSS, and structured data agree. Rebuild and deploy to publish changes; editing Markdown alone only updates the local development server.
