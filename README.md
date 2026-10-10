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
- About copy, experience, toolkit, education, article artwork: `src/data/notebook.ts`
- Project content and destinations: `src/data/projects.ts`
- Markdown articles: `content/posts/*.md`
- Full résumé: `src/data/resume.json`
- Shared shell: `src/components/layout/`
- Page sections: `src/components/about/`, `blog/`, `contact/`, and `projects/`
- Shared links, introductions, and contact banner: `src/components/shared/`
- Existing Button primitive: `src/components/ui/button.tsx`
- Palette, typography, and responsive layout: `src/app/globals.css`
- Illustration sources and prompts: `docs/illustrations.md`

The homepage uses `NotebookHero`, `ProjectIndex`, the compact About introduction, the existing toolkit and career timeline, and `ContactPostcard`. Homepage styles live in `src/app/home.css`; other routes keep their shared styles. Unused legacy homepage modules and their private helpers have been removed; Git history retains earlier implementations.

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
