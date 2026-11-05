# SEO and performance: primary-source research

Reviewed 2026-11-05 for this repository's Next.js **16.1.6** App Router portfolio/blog on Netlify. Recommendations only; no application changes. Next.js documentation currently describes 16.4.5, so version-specific behavior must be checked against the installed release before implementation.

## Existing foundations

Local inspection confirms server-rendered home/article components, `generateStaticParams()` for articles, `next/image` with dimensions and responsive `sizes`, self-hosted `next/font` fonts, a click-to-play YouTube facade, canonicals, redirects, sitemap filtering for draft/noindex/external-canonical posts, `BlogPosting`/breadcrumb JSON-LD, and related-article links. Preserve these rather than rebuilding them.

Relevant code: `src/app/layout.tsx`, `src/app/blog/[slug]/page.tsx`, `src/components/home/landing-page.tsx`, `src/components/blog/youtube-video.tsx`, `src/lib/blog-seo.ts`, `src/app/sitemap.ts`, `next.config.ts`, `netlify.toml`.

## Priorities

### 1. Establish a production baseline before choosing optimizations

Google's good Core Web Vitals thresholds are **LCP ≤2.5s, INP ≤200ms, CLS ≤0.1**, assessed at the **75th percentile**, separately for mobile and desktop. Use these as the acceptance floor; any tighter project budget should be labeled an internal target. [Google Web Vitals](https://web.dev/articles/vitals).

Measure `/`, `/blog`, an image-led article, and a video-led article. PageSpeed Insights combines Lighthouse lab diagnostics with CrUX real-user data from the previous **28 days**. It may fall back from URL to origin data or show no field data when traffic is insufficient. Missing data does not establish a pass or failure. Lighthouse load tests also do not establish real-user INP; test actual navigation, search, and theme interactions. [About PageSpeed Insights](https://developers.google.com/speed/docs/insights/v5/about).

Practical next step: save repeatable mobile production traces, LCP element/subpart timings, network transfers, and representative interaction traces. Do not benchmark `next dev` or equate a Lighthouse 100 with field performance.

### 2. Optimize the actual LCP resource and image delivery

Determine whether each viewport's LCP is text, an illustration, or a video thumbnail. For an image LCP, ensure early HTML discovery and avoid lazy loading; prioritize only the critical image. Inspect TTFB, resource-discovery delay, download time, and render delay separately. [Google's LCP optimization guide](https://web.dev/articles/optimize-lcp).

The repository contains many 2–5 MB illustration PNG originals. These are candidates for source compression/versioned modern assets, but original size **does not establish the bytes visitors receive** through optimization. Inspect rendered `currentSrc`, actual transfer size, dimensions, and output format before estimating savings. Check the portrait-cropped YouTube thumbnail's fixed `sizes="1140px"` across device pixel ratios; cropping needs may justify a larger source, so compare visually rather than replacing it blindly.

Current Next.js docs deprecate `priority` from version 16 in favor of explicit `preload`; they also recommend `loading="eager"` or `fetchPriority="high"` in most cases, and advise against combining preload with those props. Accurate `sizes` enables responsive source selection. Treat a `priority` migration as clarity/maintenance, not a guaranteed speed improvement. [Next.js Image reference](https://nextjs.org/docs/app/api-reference/components/image#preload).

### 3. Verify Netlify behavior rather than assuming the self-hosted optimizer

Netlify's OpenNext adapter automatically caches static page responses at the edge and uses **Netlify Image CDN** for `next/image` by default. Confirm the deployed adapter and response behavior before treating `minimumCacheTTL` or the configured AVIF/WebP order as the production delivery mechanism. [Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/).

Netlify documents that custom headers on local source images also apply to their transformed assets. The existing `netlify.toml` `/illustrations/*` rule may therefore cover optimized browser responses too. Source `Cache-Control` controls browsers/downstream CDNs, not Netlify's internal image cache. Test actual raw and transformed responses. [Netlify Image CDN custom headers](https://docs.netlify.com/build/image-cdn/overview/#custom-headers).

### 4. Keep immutable asset caching separate from editable files

Next.js gives truly content-hashed immutable assets a one-year immutable cache policy. Keep that behavior for generated assets; stable illustration filenames that can be overwritten should not receive the same promise. Version or hash changed artwork if adopting a long browser TTL. [Next.js cache headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers#cache-control).

Netlify's CDN/browser controls are separate. CDN caches are invalidated by deploys by default, while an already-fresh browser response can still follow its local TTL. The existing five-day illustration browser cache intentionally permits that much staleness. Inspect `Cache-Control`, `Cache-Status`, and repeat-request behavior before changing it; avoid a blanket year-long rule for HTML, feeds, APIs, or mutable files. [Netlify caching overview](https://docs.netlify.com/build/caching/caching-overview/).

### 5. Reduce client JavaScript only where measurement finds weight or work

Keep markdown parsing/highlighting and static content in Server Components. A `"use client"` boundary includes its imported module graph in the client bundle; use small interactive islands. A client provider receiving server-rendered `children` does **not** automatically make the entire site client-rendered. [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components#reducing-js-bundle-size).

Measure public-route bundles before blaming installed dependencies. The large MDX editor is already dynamically imported in the local editor area; prove its absence from public route chunks. Lazy load expensive optional client libraries when their features are requested. Server Components are already code split, so wrapping every section in `dynamic()` is not a useful general rule. [Next.js lazy loading](https://nextjs.org/docs/app/guides/lazy-loading).

### 6. Inspect font preloads before removing them

`DM_Sans` and `Newsreader` are configured in the root layout with Latin subsets and swap display. `next/font` self-hosts Google font files; root-layout fonts are preloaded on every route. Limit downloaded weights/subsets to real use and inspect the emitted font requests. [Next.js font reference](https://nextjs.org/docs/app/api-reference/components/font#preloading).

Font preload competes with other critical resources. Disable a preload or scope a font to fewer routes only if it is unnecessary for first-viewport content and traces show a benefit. Keep fallback metrics and check CLS after any change. [Google font performance guidance](https://web.dev/articles/font-best-practices#be_cautious_when_using_preload_to_load_fonts).

### 7. Validate real indexing and canonical consistency

Check Search Console URL Inspection/Page Indexing for important URLs, production `200` responses, accessible indexable content, and unintended noindex directives. A technically eligible page is not guaranteed to be indexed. Robots blocking also does not reliably remove an existing URL from results. [Google technical requirements](https://developers.google.com/search/docs/essentials/technical).

Make the production origin, redirects, canonical tags, sitemap entries, and internal links agree. Check HTTP/HTTPS, www/apex, Netlify aliases, trailing slash variants, and redirected old slugs. Verify `NEXT_PUBLIC_SITE_URL` at build time. Google treats canonical declarations as signals and can select a different canonical; a sitemap alone does not force selection. [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

### 8. Grow useful search entry points, then validate schema

The existing article metadata/schema machinery is extensive. Higher-value editorial work is likely original examples, worked code, measured results, descriptive titles, clear answers, and contextual links between related engineering topics. Improve the existing LLM/inference topic cluster and project case studies without creating thin tag archives. Google emphasizes useful, original, current content and relevant links; it does **not** use the meta-keywords tag. [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

Run Rich Results Test on representative production articles and verify authors, visible dates, headline, canonical URL, and crawlable representative images. Google recommends article image variants at 16:9, 4:3, and 1:1 for best results; this is an enhancement, not a missing requirement that guarantees rich results. The current single cover can remain while higher-priority work is measured. [Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article).

## Limits

This note establishes current guidance and code-grounded opportunities. It does not contain production Lighthouse/CrUX measurements, Search Console access, a deployed-adapter inspection, or measured savings. It cannot establish that the site is slow, that indexing is broken, or that any recommendation will increase rankings. No app code or hosting settings were changed.
