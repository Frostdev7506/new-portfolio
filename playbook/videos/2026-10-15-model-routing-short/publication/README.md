# Day 5 companion article and LinkedIn draft

15 October 2026. The Day 5 video is [public on YouTube](https://youtube.com/shorts/vXV51kD1LW0). The companion article is prepared for review; this record does not claim production publication.

- Article: `content/posts/llm-model-routing-explained.md`, **LLM Model Routing Explained** (591 readable words; four-word SEO title).
- Existing article components provide the portrait YouTube thumbnail/player, canonical URL, Open Graph/Twitter metadata, BlogPosting/BreadcrumbList schema, sitemap and RSS entry. The description is 147 characters. Day 4 links forward to Day 5.
- Original cover plus pre-call and bounded-cascade diagrams are under `public/illustrations/articles/model-routing*`, in editable SVG and PNG formats. Alt text describes the flow.
- [LinkedIn copy](linkedin-draft.txt): 198 words, saved as an unpublished draft on Neeraj Butola's LinkedIn account. The composer displayed “Draft successfully saved.” Reopening confirmed the copy and matching Day 5 video preview; LinkedIn shortened the displayed URL. No post was published. No unpublished blog URL is advertised in the draft.

## Content and evidence

The article follows the approved video's topic and examples, while making the offline evaluation/live A/B distinction explicit and explaining that false acceptance does not automatically trigger retries. It does not claim measured cost savings, benchmark performance or reach improvements.

Primary sources checked on 15 October 2026: [RouteLLM](https://arxiv.org/html/2406.18665v4), [FrugalGPT](https://arxiv.org/abs/2305.05176) and [AutoMix](https://arxiv.org/abs/2310.12963). [Content Principles](https://github.com/aiwithremy/content-principles/blob/main/content-principles/SKILL.md) informed the direct, concrete writing; its platform-performance assertions are not treated as established findings.

## Verification

- `git diff --check`, `npm run lint`, all 13 existing tests and `npm run build` passed.
- The article, blog index, Day 4 article, sitemap, RSS, homepage and existing API routes returned HTTP 200. Day 5 appears in the index, sitemap, RSS and Day 4 link.
- Production HTML contains the correct title, canonical URL, video ID, cover, social metadata and structured data.
- Desktop and 390px phone views were inspected. Both diagram images loaded at 346px content width; page width remained 390px. The inline video played the correct Day 5 recording and was paused after verification.
- Local screenshots and structured checks are retained in the original repository's matching publication folder. Existing narration, video export, YouTube metadata and analytics database were not changed.
