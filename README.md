# Neeraj’s Notebook

A developer portfolio and technical blog built with Next.js App Router, React, and Tailwind. The illustrated notebook design has a shared sidebar, responsive navigation, a light/dark theme, and dedicated Home, Projects, Blog, About, and Contact pages.

## Run locally

```sh
npm ci
npm run dev
```

For a production preview:

```sh
npm run build
npm run start
```

Copy `.env.example` to `.env.local` only when configuring integrations. Set `NEXT_PUBLIC_SITE_URL` to the production domain for canonical URLs and the sitemap.

## Local Blog Studio

Run `npm run dev` and open [Blog Studio](http://127.0.0.1:3000/dev/blog), or use **Edit article** on a local blog post. The development server binds to `127.0.0.1` by default. Keep that local binding when using the editor.

- Edit existing published articles and drafts with rich text, headings, lists, links, tables, code blocks, images, and editable diagram forms, including optional inputs and outputs. Source and diff views are available in the toolbar.
- Malformed article files are listed with their filenames and validation errors while healthy articles remain editable. Repair those files outside Studio and refresh the library.
- **Article details** edits titles, descriptions, dates, tags, category, takeaway, draft status, cover and alt text, optional cover width/height, original LinkedIn source, and YouTube video ID. Existing article URLs remain fixed.
- **SEO** edits search title and meta description, shared social cards, independent X/Twitter cards, canonical URL, and indexing/preview controls. Live search/social previews and copyable JSON-LD use the same generator as the public page. Blank overrides inherit article details; SEO titles are used exactly as entered. Content checks flag heading gaps, missing image descriptions, unsupported images, unresolved references, missing/draft article links, and duplicate metadata without assigning a ranking score.
- Preview uses the site's Markdown renderer. **Save changes** or **Cmd/Ctrl+S** validates and writes to `content/posts/<slug>.md`. Typing alone does not modify the article file. Browser recovery keeps the latest unsaved copy per article when storage is available; resolve the recovery banner before continuing. A clean tab does not erase another tab’s copy. Browser Back uses recovery without a confirmation prompt.
- Upload PNG, JPEG, WebP, or GIF files up to 5 MB. Images are immediately saved under `public/illustrations/blog/`; include them when committing article changes. Unused uploads are retained so another article's image cannot be accidentally removed.
- If a file changes externally, saving stops with a conflict. Export your current edits, reload the latest file, and merge your changes. Export contains the visible article fields; saves preserve additional existing frontmatter fields.
- Drafts stay excluded from public routes, lists, RSS, and sitemap. Marking an article as published updates the local file; publishing the site still requires your normal Git/deployment workflow.

The studio page, reads, writes, and uploads all require `NODE_ENV=development`. In `next build` / `next start`, `/dev/blog` and its API operations return 404. Production blog pages have no editor links. File writes additionally require a same-origin request and loopback host, use revision checks and atomic replacement, and reject traversal and symlinks. Restarting after an interrupted save may require removing the named `.editor-lock` file; the conflict message identifies this case. Never remove a lock while another save is running.

### Blog SEO behavior

The public article emits canonical, description, Open Graph article metadata, X/Twitter cards, robots directives, and safe `BlogPosting`/`BreadcrumbList` JSON-LD. Structured data is generated from the visible article and site identity; update the title, description, cover, dates, tags/category, and content to change it. Search/social overrides do not change the visible article or invent schema facts. Article schema shares the site’s Person and Blog identities, publisher, and language. Optional `coverWidth` and `coverHeight` must be positive integers supplied together; they describe the cover in the page, image schema, and social metadata when the social card uses that same image. Changing the cover in Studio clears its previous dimensions.

Search/social frontmatter fields are `seoTitle`, `seoDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImage`, and `ogImageAlt`. Optional X-specific fields are `twitterTitle`, `twitterDescription`, `twitterImage`, `twitterImageAlt`, and `twitterCard` (`summary` or `summary_large_image`). X inherits the shared social fields by default; its creator handle comes from the configured site profile. Custom social images must be existing PNG/JPEG/WebP/GIF files beneath `/illustrations/` and have their own alt text. SVG covers remain valid article artwork; use a raster social override for sharing. Canonical overrides require absolute HTTPS URLs with no credentials or fragment. With no overrides, search uses the article title with the site name and the article description; social cards reuse that text and the article cover.

Both generic robots and Googlebot metadata use the article’s resolved settings. `noindex: true` emits `noindex` (with `follow` by default) and excludes the article from the sitemap while keeping its public page accessible. An alternate canonical also excludes the local URL from the sitemap without implying noindex. Neither setting hides the article from blog lists or RSS. Drafts remain hidden from all public article routes and listings. Search and social previews are approximate; search engines can choose different titles/snippets and structured data does not guarantee a rich result.

Advanced search controls support booleans `nofollow` and `nosnippet`, optional integer `maxSnippet` / `maxVideoPreview` (minimum -1), and `maxImagePreview` (`none`, `standard`, `large`). Blank limits leave the search engine default, -1 permits any length, and 0 requests no text snippet/static video thumbnail respectively. `nosnippet` takes priority over the text/video limits without deleting them. Reset restores existing defaults (index/follow and large images). These follow [Google’s documented robots directives](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).

The Page output panel displays exact resolved robots, canonical, social, author, language, and date settings. Search/social appearance remains available while an unrelated date/canonical/content error pauses schema output. Content checks use the local article index; they do not fetch external pages or confirm remote image availability. Image previews expose loaded dimensions and loading failures. Dates use UTC so date-only publication values agree across server and editor time zones. Markdown export omits cleared optional overrides and preserves numeric/boolean settings; additional unknown frontmatter is preserved by Save, but is not included in Export.

## Newsletter

The homepage uses a compact updates section. Set `NEXT_PUBLIC_NEWSLETTER_URL` to your newsletter provider’s full HTTPS hosted signup URL before building to show **Subscribe by email**. The provider handles signup, confirmation, subscriber storage, and unsubscribe links; no API key is embedded in the site. This link does not automatically send new posts: publish broadcasts through the provider or configure its RSS automation separately.

Until a signup URL is configured, the section offers the working `/feed.xml` feed and describes RSS only. It does not collect emails or claim anyone has subscribed.

## Contact

The form keeps the existing EmailJS integration and template variables (`user_name`, `user_email`, `message`, `to_email`). Configure `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, and `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` before building to enable direct sending.

Without all three settings, the form validates the enquiry and prepares a mailto draft for the visitor to review and send in their own email app. It never reports a message as sent in this mode. Failed direct sends preserve the message and offer the same email fallback.

## Content and components

- Profile, links, navigation: `src/data/site.ts`
- About copy, experience, education, article artwork: `src/data/notebook.ts`
- Toolkit skills, icons, and homepage selection: `src/data/toolkit.ts`
- Project content and destinations: `src/data/projects.ts`
- Markdown articles: `content/posts/*.md`
- Full résumé: `src/data/resume.json`
- Shared shell: `src/components/layout/`
- Page sections: `src/components/about/`, `blog/`, `contact/`, and `projects/`
- Shared links, introductions, and contact banner: `src/components/shared/`
- Existing Button primitive: `src/components/ui/button.tsx`
- Style entrypoint and import order: `src/app/globals.css`
- Theme, layout, page sections, and responsive rules: `src/styles/`
- Illustration sources and prompts: `docs/illustrations.md`

The homepage uses `NotebookHero`, `ProjectIndex`, `AboutSummary`, the existing toolkit and career timeline, and `ArticleUpdates`. Homepage styles live in `src/styles/home.css`; other routes keep their shared styles. Unused legacy homepage modules and their private helpers have been removed; Git history retains earlier implementations.

### Where changes belong

- `src/app/` composes pages and declares route metadata.
- `src/data/` holds editable content; components render it without duplicating it.
- `projects/project-index.tsx` renders the section heading; `project-tabs.tsx` owns Radix selection; `project-preview.tsx` renders the selected project.
- `contact/contact-form.tsx` renders the fields and feedback; `use-contact-form.ts` owns validation, submission, and fallback state. Pure validation and mailto encoding stay in `src/lib/contact.ts`.
- `home/about-summary.tsx` is the homepage introduction; `about/about-intro.tsx` is the separate About-page composition.
- `resume/resume-viewer.tsx` composes the document from its header, experience, projects, and shared section heading. Content remains in `src/data/resume.json`.
- Styles are split by purpose in `src/styles/`. Preserve the import order in `src/app/globals.css`: it preserves the existing cascade, including responsive overrides.

Component paths above are relative to `src/components/`. The existing experience timeline and integration contracts are retained.

### Replacing projects

Edit `src/data/projects.ts`. Each entry supplies `title`, `summary` (the short index label), `description`, `image`, `altText`, `technologies`, `link`, and `linkLabel`. Keep titles unique. Place screenshots in `public/` and use their root-relative paths (for example, `/my-project.png`). The preview uses a consistent 16:9 image area.

The first three entries appear in the homepage selector; all entries appear on `/projects`. Replace or reorder entries in this one array to update both views—no per-project component or CSS changes are needed. Project selection supports mouse, touch, arrow keys, Home, and End through the existing Radix library. Source links open in a new tab. The homepage updates section replaces the former contact postcard; the full contact form remains at `/contact`.

## Routes

`/`, `/projects`, `/blog`, `/blog/[slug]`, `/about`, `/contact`, `/resume`, `/privacy`, and `/editorial-policy`.

Supporting endpoints: `/api/hello`, `/api/github-repos`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/manifest.webmanifest`.

## Verification

```sh
npm run lint
npm test
npm run build
npm run test:editor-production
```

The production smoke test starts an isolated production server and verifies the studio and API operations return 404, editor links are absent, every public article’s rendered metadata, JSON-LD, robots and sitemap match the shared editor generator, and article files and assets remain unchanged.

The Node test suite covers article parsing, Markdown preservation, editor file protections, SEO fallbacks/overrides, canonical and indexing behavior, JSON-LD escaping, RSS, contact validation, and mailto encoding. Tests were run with Node 24 (native TypeScript support). Browser coverage and visual comparison evidence are recorded in `design-qa.md`. Performance benchmarking and live EmailJS delivery are separate follow-up checks.
