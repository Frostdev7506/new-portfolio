# SEO-First Developer Portfolio (Next.js App Router)

This project is a production-ready, SEO-first developer portfolio built with Next.js App Router and Tailwind CSS.

## Feature Parity Maintained

- Homepage with:
- Hero/intro and social links
- Tech stack section
- Career aspirations section
- Achievements section
- Portfolio projects section
- Resume preview + download
- GitHub repositories with language filtering + pagination
- Contact form (EmailJS)
- Blog index page (`/blog`)
- Blog detail pages (`/blog/[slug]`) rendered from Markdown
- Share buttons on blog posts
- Existing API parity route (`/api/hello`)

## SEO + Indexing Enhancements

- App Router metadata across pages
- Canonical URLs and social cards
- Structured data (WebSite, Person, BlogPosting)
- Dynamic `sitemap.xml` and `robots.txt`
- `llms.txt` route for AI discoverability
- Semantic sectioning and heading hierarchy

## Performance-Oriented Choices

- Server-rendered route structure
- Optimized Next.js images and font loading
- Data-driven content model for static generation of blog pages
- Reduced client-side JS except where interactivity is required

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file and fill values:

```bash
cp .env.example .env.local
```

3. Run development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
npm run start
```

## Content Editing

- Blog posts: `content/posts/*.md`
- Site profile and navigation: `src/data/site.ts`
- Tech stack: `src/data/tech-stack.ts`
- Projects: `src/data/projects.ts`
- Achievements: `src/data/achievements.ts`
- Aspirations: `src/data/aspirations.ts`

## Routes

- `/`
- `/blog`
- `/blog/[slug]`
- `/api/hello`
- `/api/github-repos`
- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`
