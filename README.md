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

The homepage uses `NotebookHero`, `ProjectIndex`, `AboutSummary`, the existing toolkit and career timeline, and `ContactPostcard`. Homepage styles live in `src/styles/home.css`; other routes keep their shared styles. Unused legacy homepage modules and their private helpers have been removed; Git history retains earlier implementations.

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

The first three entries appear in the homepage selector; all entries appear on `/projects`. Replace or reorder entries in this one array to update both views—no per-project component or CSS changes are needed. Project selection supports mouse, touch, arrow keys, Home, and End through the existing Radix library. Source links open in a new tab. The postcard opens the visitor’s email app; the full contact form remains at `/contact`.

## Routes

`/`, `/projects`, `/blog`, `/blog/[slug]`, `/about`, `/contact`, `/resume`, `/privacy`, and `/editorial-policy`.

Supporting endpoints: `/api/hello`, `/api/github-repos`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/manifest.webmanifest`.

## Verification

```sh
npm run lint
npm test
npm run build
```

The small Node test suite checks contact validation and mailto encoding. Tests were run with Node 24 (native TypeScript support). Browser coverage and visual comparison evidence are recorded in `design-qa.md`. Performance benchmarking and live EmailJS delivery are separate follow-up checks.
