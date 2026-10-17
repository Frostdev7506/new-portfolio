# Day 6 and Day 7 article discovery review

Reviewed 18 October 2026 against `main` at `6d77139`. This PR adds the two articles and their covers, with publication enabled for the next deployment. It does not change the shared SEO runtime, crawler policy, site design, or video uploads.

## Editorial and metadata changes

| Article | Search title | Coverage |
| --- | --- | --- |
| Day 6 | Context Engineering vs Prompt Engineering Explained | Customer-return example, application/tool loop, prompt comparison, context-window limits and evaluation. |
| Day 7 | Prompt Injection Explained: Direct and Indirect Attacks | PDF example, attack entry points, backend permissions, exact-action approval and tests. |

Both have unique descriptions, 1200×630 PNG social covers with descriptive alt text, primary-source citations, visible text explaining their diagrams, and a relevant link to the other article. Day 6 retains the user's comparison-focused social metadata. Copy edits fix typos and qualify the SQL-injection comparison without replacing the saved Studio edits.

## Existing discovery features verified

The metadata pipeline already supplies self-canonicals, author attribution, publication/modification dates, Open Graph Article and X large-image cards, `BlogPosting` and `BreadcrumbList` JSON-LD, and `index, follow, max-image-preview:large`.

The final production responses were checked for both articles with simulated Googlebot, bingbot and OAI-SearchBot user agents. Each returns HTTP 200, one H1, one title/description/canonical, matching structured data, and the article's Markdown alternate. The full Markdown response retains the article text, diagrams, absolute cross-links and video URL, with a canonical HTTP Link header.

Both articles appear in `/blog`, `/sitemap.xml`, `/feed.xml`, `/llms.txt`, `/llms.md`, `/llms-full.md` and `/llms-full.txt`. Both PNG covers return 200. The existing wildcard robots policy permits crawling and advertises the sitemap.

See [verification.json](verification.json), [Day 6 preview](context-engineering-preview.png) and [Day 7 preview](prompt-injection-preview.png). Day 7's video is scheduled for 14:00 IST on 18 October and may show no thumbnail/playback before release; the article text remains available independently.

## Evidence and limits

- `npm run lint`: passed.
- `npm test`: 92 passed.
- `npm run build`: passed; both HTML and Markdown article routes generated.
- Independent standards and specification reviews completed. Cover spacing and two prompt-injection wording issues were corrected and rechecked.
- Production HTML and Markdown checks passed after the final content changes. Desktop article previews were inspected. No site layout code changed.

The user-agent checks run locally. They do not prove that a deployed CDN admits real crawler IPs, that engines have indexed a URL, or that rankings/citations will improve. Search Console, Bing Webmaster Tools and crawler logs were not accessed.

## Guidance used

- [Google title links](https://developers.google.com/search/docs/appearance/title-link) and [snippets](https://developers.google.com/search/docs/appearance/snippet): concise, descriptive titles and summaries; Google may choose different wording.
- [Google Article markup](https://developers.google.com/search/docs/appearance/structured-data/article): representative images, clear authorship and truthful dates. Markup provides eligibility, not a guaranteed rich result.
- [Google AI features](https://developers.google.com/search/docs/appearance/ai-features): ordinary search eligibility and useful visible text still apply; no special AI schema or text file is required.
- [Bing sitemap guidance](https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/): canonical URLs and accurate modification dates support discovery. [IndexNow](https://www.indexnow.org/documentation) can notify engines after future publishing, but receipt does not guarantee indexing.
- [OpenAI crawler controls](https://developers.openai.com/api/docs/bots): OAI-SearchBot is for search, while GPTBot controls possible training use. This PR leaves the user's current crawler policy unchanged.
- [llms.txt proposal](https://llmstxt.org/): the existing Markdown endpoints are an additional reading aid, not a ranking or citation guarantee.

After merge and deployment, inspect the two public URLs and submit the sitemap/URLs through Google Search Console and Bing Webmaster Tools. Those account actions are separate from this PR; they have not been performed or scheduled.
