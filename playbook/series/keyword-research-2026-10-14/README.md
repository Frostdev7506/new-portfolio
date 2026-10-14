# AI Engineering series: search wording and video presentation

Observed 14 October 2026. Scope: the four existing companion articles; no change to the published videos.

## What Google showed

[Google Trends comparison](https://trends.google.com/trends/explore?date=today%2012-m&q=kv%20cache,kv%20caching,prompt%20caching,semantic%20caching,prefill%20vs%20decode), Worldwide, Web Search, All categories, past 12 months:

| Search term | Average normalized index |
| --- | ---: |
| kv cache | 46 |
| kv caching | 2 |
| prompt caching | 17 |
| semantic caching | 2 |
| prefill vs decode | 1 |

These are relative indices in one comparison, not monthly searches, percentages or proof of future rankings. A low index does not mean no demand. Prefill vs decode had insufficient related-query data. The comparison supports using “KV cache” rather than “KV caching”; it does not establish that every topic is currently rising. Google explains the normalization and sampling in its [Trends FAQ](https://support.google.com/trends/answer/4365533?hl=en).

Google Keyword Planner was unavailable because the signed-in account had no Google Ads account. No account, campaign or billing setup was created. No monthly volume or competition estimates were obtained.

Visible Google search results showed informational intent: “What is a KV cache?”, “What is a semantic cache?”, prefill/decode comparisons, and prompt-caching explanations. Relevant results included [Redis's semantic-caching introduction](https://redis.io/blog/what-is-semantic-caching/), [NVIDIA's inference explanation](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/) and [OpenAI's prompt-caching guide](https://developers.openai.com/api/docs/guides/prompt-caching). Search result wording is an intent signal, not a volume measurement. Unrelated rising queries were excluded.

## Editorial decisions

Keep the core topic first and use “Explained” to describe the articles' existing teaching intent. That suffix is an editorial choice, not a claimed winning keyword. All headline and absolute SEO titles stay within the user's four-word limit.

| Day | Title | New slug | Previous slug |
| --- | --- | --- | --- |
| 1 | KV Cache Explained | kv-cache-explained | kv-caching |
| 2 | Prefill vs Decode Explained | prefill-vs-decode-explained | prefill-vs-decode |
| 3 | Prompt Caching Explained | prompt-caching-explained | prompt-caching |
| 4 | Semantic Caching Explained | semantic-caching-explained | semantic-caching |

Permanent redirects preserve old links. Internal series links, canonicals, social URLs, RSS and sitemap use the new locations. Clear hyphenated URLs follow [Google's URL guidance](https://developers.google.com/search/docs/crawling-indexing/url-structure); the migration is not evidence of ranking improvement.

## Images and videos

The four covers and two Day 4 inline illustrations were reviewed at full size and phone width. The artwork explains reuse, token progression and hit/miss routes; keep it rather than add decorative stock images. Day 2's alt text now states that prefill produces the first reply token before decode continues.

Each article uses its own public YouTube thumbnail with a portrait, click-to-play player. The iframe loads only after activation, using YouTube's privacy-enhanced host and an accessible play button. A direct YouTube fallback remains. Existing illustrations remain available for social previews and explanatory content.

No increase in views, search impressions, CTR or ranking is claimed. Compare performance only after production publication and sufficient data.
