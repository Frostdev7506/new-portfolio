# Inner-page design alignment

17 October 2026 · `feature/unify-inner-page-design`, based on `main` at `74f1a06`.

## Direction

Extend the approved landing page to the rest of the portfolio: the custom N masthead, Newsreader display type, DM Sans body text, cream and forest themes, restrained teal accents, open layouts and fewer decorative boundaries. Keep the homepage's original interactive project selector and approved content.

The repository-local `frontend-design` and `web-design-guidelines` skills guided this work, alongside the Matt Pocock engineering and review guidance. The [current Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md) were fetched and reviewed on 17 October 2026.

## Changes

- One shared masthead, skip link, container system and footer replace the older sidebar shell. Homepage navigation keeps its section anchors; inner pages navigate to routes and identify the active page.
- Blog: a simple Blog heading, visible Home / Blog breadcrumb, and five curated featured articles in an open, manually controlled row. Three previews appear on desktop, two on tablet and one with a glimpse of the next on phones. Covers and titles link directly to articles; excerpts, repeated calls to action and the tinted enclosure are removed. The archive retains full-width search, clear/reset actions and topic controls. Featured selection is maintained in `src/data/notebook.ts`; this is an editorial selection, not an analytics ranking.
- Breadcrumbs: every public inner page has Home / Page navigation; articles add the Blog level. All indexable inner pages emit exactly one matching BreadcrumbList. The shared component uses the visible items for structured data; article trails derive from their existing SEO data, and Blog retains its linked CollectionPage. Long current titles truncate visually on narrow screens while retaining their full accessible text. The homepage and local Blog Studio have no breadcrumb, and breadcrumbs are hidden when printing. Missing-page states offer navigation without inventing indexed URLs. Existing title, description, canonical, Open Graph, Twitter and RSS metadata remain intact.
- Articles: serif title and cover/video composition, a reading column capped at 720px, desktop table of contents and expandable mobile navigation.
- About, Projects, Contact and Résumé: matching type, spacing, image proportions and controls. Résumé printing uses a white canvas in either theme.
- Privacy, Editorial policy and missing-page states use the same document typography. Blog Studio keeps a stacked preview header to fit its editing pane.

Article content and article metadata, profile and project data, API behavior and static assets are unchanged. Blog introduction copy, featured selection and index structured data were updated; inner pages gained matching breadcrumb structured data. No new package or environment configuration is required.

## Verification

- `npm run lint` and `npm run build`: passed; 53 pages generated.
- `npm test`: 92 passed, zero failures.
- `npm run test:editor-production`: passed; development editor routes remain unavailable in production and all sixteen public articles retain metadata parity.
- Reviewed desktop and mobile layouts at 1440, 390 and 320px in light and dark themes; secondary pages also checked at 901px. No horizontal document overflow found in the reviewed routes.
- Blog search, combined topic filtering, zero-results state and reset work. Article TOC expansion and anchor jumps, active section tracking, code copying, internally scrolling code, responsive tables and privacy-enhanced video controls work.
- Featured articles use native horizontal scrolling and previous/next buttons, with endpoints instead of wrapping. The visible range is announced, offscreen stories are inert, and motion follows the reduced-motion preference. No autoplay is used. Search clear/reset returns focus to the input; long queries and narrow layouts remain contained.
- Breadcrumb checks cover both themes at 320 and 1440px on the homepage, six static inner pages, Blog, two articles and both missing-page states. Exactly one trail appears on each inner page; none appears on Home. Production HTML checks cover all 24 public pages, including every article: each inner page has one matching BreadcrumbList with ordered positions and absolute URLs, and Home has none.
- Verified keyboard skip-to-main, active route navigation, theme persistence and the homepage project selector's arrow-key behavior. The homepage newsletter heading remains 32px and the hero retains its approved height.
- Empty contact submission shows three field errors and focuses the name field. Form fields have visible keyboard focus. No contact message or newsletter subscription was sent.
- Actual A4 résumé exports from light and dark themes contain three readable pages with white margins and no blank trailing page.
- Blog Studio's split preview remains stacked and fits its column. No article was edited or saved during browser checks.

These checks cover the observed Chromium layouts and interactions; they are not a full screen-reader or cross-browser audit. Screenshots are from the development server. Blog Studio is available directly at `/dev/blog` for local development; editor shortcuts are excluded from the public blog and article design in every environment.

## Publishing references

Reviewed the actual desktop and mobile pages of [The Medium Blog](https://medium.com/blog), [DEV](https://dev.to/) and [Smashing Magazine](https://www.smashingmagazine.com/). Medium exposes a lead story and smaller supporting stories on the page background; DEV prioritizes headlines after a lead cover; Smashing uses typographic hierarchy for its lead and supporting articles. The implementation adapts that open presentation into the requested five-article carousel. The manual carousel is our adaptation, not a feature attributed to those reference pages.

Breadcrumb markup follows [Google's breadcrumb guidance](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) and [Next.js JSON-LD guidance](https://nextjs.org/docs/app/guides/json-ld). There is no unsupported breadcrumb meta tag; existing search and social metadata accompany BreadcrumbList structured data.

## Review screenshots

- [Blog desktop](screenshots/blog-desktop-light.png)
- [Blog mobile, dark theme](screenshots/blog-mobile-dark.png)
- [Search and topic filters](screenshots/blog-search.png)
- [Article breadcrumb on mobile](screenshots/article-breadcrumb-mobile-dark.png)
- [Policy breadcrumb](screenshots/policy-breadcrumb-desktop-light.png)
- [Article reading layout](screenshots/article-reading-desktop-dark.png)
- [Mobile article navigation](screenshots/article-toc-mobile-320.png)
- [Projects](screenshots/projects-desktop-light.jpg)
- [Contact, dark theme](screenshots/contact-desktop-dark.png)

## Local preview

```sh
npm run dev -- --port 4178
```

Open `http://127.0.0.1:4178/blog`. Transient browser captures and résumé print exports are in the ignored `output` review directories.
