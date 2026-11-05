# SEO and performance audit — 5 November 2026

The best next step is a small image-delivery pass, followed by production latency checks and search-content improvements. The existing static Next.js architecture is already a good fit. This audit does not change application code or hosting settings.

## Measured baseline

Lighthouse 13.6.0, Chrome 156, mobile simulation at 412 × 823, DPR 1.75, simulated mobile network and 4× CPU slowdown. Runs originated from this workstation. Each row is one cold-browser lab navigation, not a real-user percentile or a repeatable performance guarantee.

| Production route | Performance | SEO checks | LCP | Blocking time | CLS | Total transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 93 | 100 | 2.88 s | 8 ms | 0 | 491 KiB |
| `/blog` | 87 | 100 | 3.46 s | 29 ms | 0 | 628 KiB |
| `/blog/machine-learning-basics-in-plain-english` | 91 | 100 | 3.05 s | 15 ms | 0 | 446 KiB |
| `/blog/llm-model-routing` | 95 | 100 | 2.74 s | 15 ms | 0 | 433 KiB |

Repeat cold-browser runs reached **100 / 1.0 s LCP** on the production homepage and **92 / 2.93 s LCP** on the production blog, both with zero CLS. The homepage's observed server-response time changed from 1,079 ms to 69 ms. This spread makes multi-run and field measurements essential; the initial table is not a stable site-wide benchmark or evidence of consistently slow hosting.

The current local **production build**, including the unshipped UI polish, scored 100 / 0.91 s LCP on `/` and 95 / 2.92 s LCP on `/blog`. Localhost removes internet/CDN latency and uses Next.js's local image optimizer; these results cannot predict deployed scores or attribute all differences to the UI changes.

No Lighthouse run warnings were returned. The PageSpeed API returned HTTP 429, so this audit obtained **no CrUX field data**. Lighthouse blocking time is not real-user INP. Google's good field targets are p75 LCP ≤2.5 s, INP ≤200 ms, and CLS ≤0.1. [Web Vitals](https://web.dev/articles/vitals), [PageSpeed Insights methodology](https://developers.google.com/speed/docs/insights/v5/about).

Raw reports and a compact measurement JSON are saved outside Git at:

`/Users/neeraj/.codex/visualizations/2026/11/05/01a1ac02-8b7e-7ab0-8b97-00c6faf7aadc/seo-performance/`

## Recommended implementation order

### 1. Reduce competing image requests on the blog

- `src/components/blog/featured-article.tsx:38` eagerly loads the first **three** covers at every viewport. On the mobile layout, only one complete card is visible. The production trace downloaded the adjacent optimistic-uploads cover at about **59 KiB** and the third cover at about **37 KiB**. Preserve immediate loading of the first cover; test lazy loading for the remaining cards. Native lazy loading can still fetch nearby images, so measure actual requests rather than promising all those bytes disappear.
- The first featured image is the measured blog LCP element. Its request is discoverable in initial HTML, but Lighthouse recommends a high fetch-priority hint. Test the appropriate Next.js 16 image props on that image alone. Replacing the deprecated `priority` prop by itself is not a performance result. [Next.js Image reference](https://nextjs.org/docs/app/api-reference/components/image#preload).
- Review responsive `sizes` in featured cards and article-list cards against actual widths at 390, 768, and 1440 px. Keep high-DPR sharpness; do not blindly accept Lighthouse's estimated image savings.
- Visually compare source compression and output quality for the frequently used illustration covers. Keep the existing artwork and aspect ratios.

Acceptance: reduced cold mobile image transfer or faster LCP over repeated deployed traces, with no visible quality loss, blank carousel navigation, layout shift, or keyboard regression.

### 2. Finish the homepage image pass already started by the UI work

Production still serves the previous hero layout. It requested a 750 px workbench image whose WebP body was **110,258 bytes**. The current local hero uses a 288 px mobile slot and selected a 640 px image; its locally optimized body was **50,381 bytes**. Width and optimizer format both differ, so this is not a verified production saving.

After deploying the UI normally, remeasure the actual Netlify response. Consider a smaller, versioned WebP/AVIF source only if visual comparison and transferred bytes justify it. The repository's **65 MB** public directory is not a page download: visitors already receive transformed images, not every large PNG original. Optimize the actual critical path. [LCP optimization](https://web.dev/articles/optimize-lcp).

### 3. Investigate delivery latency before changing caching

Three sequential curl requests measured homepage TTFB at **0.49–0.58 s** and blog TTFB at **0.50–0.96 s** from this workstation. Lighthouse's observed initial homepage server-response time was approximately 1.08 s. These are location- and connection-dependent observations, not a global server benchmark.

HTML responses reported `Next.js` and Netlify Durable cache hits, while Netlify Edge reported forwarding a miss. Pages are already prerendered: converting them to another rendering mode is not the first fix. Check request traces and multiple geographic locations before adjusting adapter/cache configuration.

The transformed hero response was WebP with the intended **five-day** browser cache. Preserve bounded caching for editable filenames; version assets before assigning a year-long immutable policy. Leave generated content-hashed assets immutable. Netlify uses its Image CDN for `next/image`, so local optimizer settings do not fully describe production behavior. [Netlify Next.js delivery](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/), [Image CDN headers](https://docs.netlify.com/build/image-cdn/overview/#custom-headers).

### 4. Keep JavaScript and fonts under a budget

Production traces transferred roughly **162–177 KiB of JavaScript**, **93 KiB of fonts**, and **18 KiB of CSS**. Blocking time was low. Public initial script checks found no MDXEditor/Lexical/CodeMirror/parser signatures; markdown parsing and highlighting remain on the server.

Lower-priority experiments: restrict font axes/weights only if the same typography can be preserved; measure optional client islands; inspect prefetch competition on `/blog`, whose trace included many small RSC requests. Preserve fast subsequent navigation when evaluating any selective prefetch changes. Do not add a large performance/animation library or rewrite the component structure merely to reduce a score warning. [Next.js client boundaries](https://nextjs.org/docs/app/getting-started/server-and-client-components#reducing-js-bundle-size).

## SEO: what is already working

- The local sitemap contains **29 indexable URLs**; each returned 200 with exactly one H1, one description, one canonical, no noindex directive, and no image missing an alt attribute. This is a structural check, not a judgment of alt-text quality.
- The four tested production pages passed Lighthouse's basic SEO checks. A 100 is not proof of indexing, rankings, or complete structured-data validity.
- Existing implementation includes article JSON-LD, authorship, publication/update dates, breadcrumbs, sitemap, robots, related posts, self-hosted fonts, static article rendering, and click-to-play YouTube embeds. Preserve these.
- Production HTTP → HTTPS and www → apex redirected permanently in one observed hop; `/blog/` redirected to `/blog` with 308.

SEOmator's scoped **Core** crawl covered 25 production pages: 442 checks passed, 33 warnings, zero failures. All warnings concerned title/description character counts or its incorrect interpretation of `max-snippet:-1`. The latter explicitly allows unlimited snippet length according to [Google's robots reference](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#max-snippet). Keep that setting. Character-count heuristics alone do not justify padding or truncating useful copy. An initial all-category crawl was stopped after roughly five minutes without a report; this is not a completed security, accessibility, or exhaustive link audit.

## SEO: the next useful improvements

1. **Verify indexing and demand in Search Console.** Inspect the homepage, blog, and priority articles; compare submitted and Google-selected canonicals, index coverage, impressions, and actual query CTR. No Search Console account was inspected in this audit.
2. **Publish substantive Fullstack AI engineering project case studies.** Explain the problem, architecture, data flow, tradeoffs, implementation, and measured outcomes using real project evidence. Link the profile and relevant articles to these pages naturally.
3. **Strengthen contextual links within articles.** The LLM routing, inference, caching, RAG, and MCP material already forms a useful topic cluster. Link related explanations where a reader needs them, alongside the existing related-post footer.
4. **Refine titles and snippets using observed search queries.** Keep one clear intent per article and the updated Fullstack AI Engineer identity. Avoid keyword stuffing or artificial title-length rules; meta keywords are not used by Google. [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).
5. **Validate representative article rich results.** Check the production image, author, visible dates, and canonical consistency. Add deliberately designed social/article image variants if useful; schema enhancements do not guarantee a rich result. [Google Article guidance](https://developers.google.com/search/docs/appearance/structured-data/article).

## Validation for the implementation pass

Keep changes focused and measure them separately: baseline → one change → repeated production mobile runs. Track field Core Web Vitals when data becomes available, plus search/filter, carousel, theme, and navigation interactions on a real phone. Run repository lint/build/tests and check desktop/mobile appearance before shipping. Use Lighthouse CI or a small repeatable audit script to catch regressions; avoid treating a localhost score as a production acceptance test.

Current textbox polish was separately checked with lint, production build, 94 passing tests, and browser search/clear/keyboard verification. Its green focus outline and glow preserve the compound control's visible focus indicator.

See [the primary-source research note](2026-11-05-seo-performance-primary-sources.md) for additional source details and caveats.
