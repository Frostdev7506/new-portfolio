# Landing page recreation

Local preview: `http://127.0.0.1:4178/`.

Branch: `feature/recreate-landing-page`, created from `main` at `8e407dc` after PR #14 merged.

## Skill installation and execution

The requested [felix-huber skill](https://github.com/felix-huber/ui-landingpage-generator-skill) is installed only in this repository at `.codex/skills/ui-landingpage-generator`. Upstream source, license and script are retained unchanged at commit `8dc143767218bc884b502a054b5d3fc401411a4b`; provenance is recorded in `.codex/skills/sources.json`.

The bundled script was attempted locally and exited at its prerequisite check: `Error: gemini is not installed`. Claude Code is also absent. No global CLI or skill installation was made. Codex applied the skill’s context analysis, design brief, implementation and review stages directly in the existing Next.js application. This page is not represented as output from the Gemini/Claude pipeline.

See [design brief](design-brief.md) for the selected direction and constraints.

## Result

The homepage uses a horizontal masthead with a custom N monogram, full-width editorial hero, original interactive project selector with a large preview, grouped technology rows and a compact logo timeline. A single typographic “Let’s talk.” action replaces the tinted contact banner and duplicate email controls. It retains the exact approved hero copy, single Blog action, nineteen technology logos, four jobs, About section, newsletter and RSS. The newsletter helper line is removed; Privacy remains in the footer. Homepage styles are scoped; inner pages keep their existing shell and content.

## Verification

- `npm run lint`: passed.
- `npm test`: 92 passed, zero failures.
- `npm run build`: passed, 53 pages generated.
- `npm run test:editor-production`: passed; editor routes remain disabled and all sixteen public articles retain exact metadata parity.
- Browser layouts: 320, 390, 700, 768, 901 and 1440px, in light and dark themes; no horizontal document overflow or broken images.
- Verified one H1, one hero CTA, all nineteen toolkit icons and four circular company logos.
- Theme toggle persists the chosen theme; Blog navigation restores the inner-page shell. The first keyboard Tab reaches Skip to content, and Enter focuses the hero heading after the masthead.
- Dark-mode illustration contrast and newsletter spacing were corrected during visual review.
- Reduced-motion emulation removes the hero animation. Home, blog, article, API, RSS and Markdown-index smoke checks returned 200.
- Final follow-up checks: project selection works by click and ArrowDown; the contact action has visible keyboard focus and respects reduced motion; newsletter helper text is absent and the footer Privacy link remains.

## Review screenshots

- [Desktop hero](screenshots/hero-desktop.png)
- [Mobile hero](screenshots/hero-mobile.png)
- [Restored project selector](screenshots/projects-desktop.png)
- [Contact invitation](screenshots/contact-desktop.png)

External email/newsletter delivery was not submitted. These checks are not a full assistive-technology or cross-browser audit.

## Run again

```sh
npm ci
npm run dev -- --port 4178
```

Additional screenshots and transient browser checks are in `output/playwright/landing-recreation/` (ignored by Git).
