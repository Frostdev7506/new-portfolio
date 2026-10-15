# Day 5 companion article and LinkedIn draft

15 October 2026. The Day 5 video is [public on YouTube](https://youtube.com/shorts/vXV51kD1LW0). The companion article is prepared for review; this record does not claim production publication.

- Article: `content/posts/llm-model-routing.md`, **LLM Model Routing Explained** (598 readable words; four-word SEO title).
- Existing article components provide the portrait YouTube thumbnail/player, canonical URL, Open Graph/Twitter metadata, BlogPosting/BreadcrumbList schema, sitemap and RSS entry. The description is 145 characters. Day 4 links forward to Day 5.
- Original cover plus pre-call and bounded-cascade diagrams are under `public/illustrations/articles/model-routing*`, in editable SVG and PNG formats. Alt text describes the flow.
- [LinkedIn copy](linkedin-draft.txt): 198 words, saved as an unpublished draft on Neeraj Butola's LinkedIn account. The composer displayed “Draft successfully saved.” Reopening confirmed the copy and matching Day 5 video preview; LinkedIn shortened the displayed URL. No post was published. No unpublished blog URL is advertised in the draft.

## Content and evidence

The article follows the approved video's topic and examples, while making the offline evaluation/live A/B distinction explicit and explaining that false acceptance does not automatically trigger retries. It does not claim measured cost savings, benchmark performance or reach improvements.

Primary sources checked on 15 October 2026: [RouteLLM](https://arxiv.org/html/2406.18665v4), [FrugalGPT](https://arxiv.org/abs/2305.05176) and [AutoMix](https://arxiv.org/abs/2310.12963). [Content Principles](https://github.com/aiwithremy/content-principles/blob/main/content-principles/SKILL.md) informed the direct, concrete writing; its platform-performance assertions are not treated as established findings.

## Verification

- `git diff --check`, `npm run lint`, all 15 tests and `npm run build` passed.
- The article, blog index, Day 4 article, sitemap, RSS, homepage and existing API routes returned HTTP 200. Day 5 appears in the index, sitemap, RSS and Day 4 link.
- Production HTML contains the correct title, canonical URL, video ID, cover, social metadata and structured data.
- Desktop and 390px phone views were inspected. Both diagram images loaded at 346px content width; page width remained 390px. The inline video played the correct Day 5 recording and was paused after verification.
- Local screenshots and structured checks are retained in the original repository's matching publication folder. Existing narration, video export, YouTube metadata and analytics database were not changed.

## SEO refinement and image handoff

The intended production URL is https://neerajbutola.in/blog/llm-model-routing. It becomes available after PR #9 is merged and deployed. The former `/blog/llm-model-routing-explained` path permanently redirects (308) to the shorter slug. Section headings, opening definition and descriptive image alternatives match the article's model-routing topic.

The cover's verified 1200×630 dimensions are emitted in Open Graph and BlogPosting ImageObject metadata. Twitter receives image alt text. Article language and the author's `/about` URL are explicit; older posts may omit dimensions. The production HTML, redirect, title/H1, canonical, social metadata, schema, table-of-contents targets, Day 4 link, sitemap and RSS passed runtime assertions. Homepage, blog and existing API routes returned HTTP 200. Desktop and 390px phone title/description layout were inspected without horizontal overflow.

The user subsequently edited the LinkedIn text. Their revised text was preserved locally before the media picker opened. Image attachment was not completed; the user chose to add the images manually. The three original PNGs were copied and hash-verified in `/Users/neeraj/Downloads/Day-5-LinkedIn-Images`, numbered cover, pre-call, then cascade. No LinkedIn post was published by this work. The historical linked copy above is the initial saved draft, not the user's latest revision.

## Shared diagram and table refinement

The user flagged the plain text-column diagram and table presentation, including its reuse in other articles. The shared renderer now distinguishes numbered process steps with directional arrows from unordered comparison panels. It adapts to narrow article containers and long processes. Day 5's comparison has an explicit shared test set and shared scoring criteria, with validated optional input/output nodes included in reading-time counts. Other article wording is preserved.

Tables now have contained rounded borders, tinted column headers, stronger first-column labels and smaller, consistent typography. Wider tables scroll within the article; their first column stays visible and the scroll region supports keyboard access. Header cells explicitly use column scope. Both features follow the existing light/dark theme tokens.

Fresh lint, 17 tests and a production build passed before the final table sticky-column CSS refinement; lint/build were rerun for that final CSS change. An independent source review covered the 16 existing article diagrams. Browser checks covered Day 5, the Day 1 process, a three-way comparison and a four-step process, plus two-column and three-column tables at phone width. Two-column content fits at 390px without page overflow; the three-column table scrolls internally. Screenshot evidence is in the local publication folder. This is a scoped component review, not a full accessibility audit.
