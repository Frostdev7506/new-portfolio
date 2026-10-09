# Notebook portfolio — design QA

final result: passed

Reviewed 2026-10-10 against the selected notebook designs, using the production preview at http://localhost:3107.

## Latest acceptance: Experience timeline

The user's Experience annotation requests a timeline and rejects the boxed current-role treatment. This revision changes only the homepage work-history presentation: a continuous fine teal line connects three Lucide milestones, the current position uses an orange marker and a Caveat “now” note, and dates align to the left on desktop. Mobile places the dates above each role beside the timeline. The role names, dates, descriptions, résumé destination, and About-page layout are retained.

Source evidence: the user's annotated screenshot in this conversation and the [before capture](docs/screenshots/revision-3/before.jpg). [Combined composition and focused comparison](docs/screenshots/revision-3/comparison.jpg) shows the old and new layouts side by side, including readable current-role typography and marker details. [Desktop result](docs/screenshots/revision-3/desktop.jpg), [phone result](docs/screenshots/revision-3/mobile.jpg), [320px result](docs/screenshots/revision-3/width-320.jpg), [dark result](docs/screenshots/revision-3/dark.jpg).

The desktop source and revised captures use the same light state, section anchor, and browser-reported 1414 × 719 CSS viewport; both capture files are 1326 × 719 content images from the browser provider. The board scales both equally and preserves their aspect ratios. Its focused detail uses the actual captures at native image size. The original annotation is a change brief, so the requested removal of boxes and addition of the connecting line are intentional differences.

Fidelity review: DM Sans company/role text remains; dates use the existing monospace family and the current marker uses the existing handwritten font. Spacing separates chapters without card surfaces or row dividers. Teal and orange match the notebook palette in both themes. Milestones and the small arrow are library icons, not raster or custom SVG substitutes. All work-history copy is unchanged. Full and focused comparisons were inspected; no actionable P0/P1/P2 finding remains.

Verification: lint, production build, and whitespace checks passed. At 320px, 390px, 768px, 1024px, and desktop widths the document had no horizontal overflow; all three milestones shared the same horizontal position at each tested width. Desktop, phone, and dark captures were inspected. The résumé link was clicked and reached `/resume`; no console warnings or errors were captured. The timeline remains an ordered list, decorative markers are hidden from assistive technology, and the visual “now” note has explicit screen-reader text. No new test was added for this presentation-only change. Performance benchmarking remains deferred.

---

## Previous acceptance: annotated homepage revision

The user's four browser annotations supersede the original mockup for the homepage About, toolkit, Experience, and contact banner. The hero, projects, sidebar, and other route compositions retain the prior design. No new image assets or dependencies were needed.

- **About:** replaced the repeated biography and large notebook image with a clear end-to-end capability statement, three concrete work areas grounded in the existing résumé, and an About link.
- **Toolkit:** added the existing Lucide interface, server, and cloud icons; kept text labels and technology names.
- **Experience:** separated dates from role details, added work summaries, highlighted the current role, and placed the résumé link beside the heading. The shared work summaries also appear on About.
- **Contact:** replaced the pale strip with a dark teal panel, larger heading, cream action button, direct email link, and the existing envelope asset.

### Evidence and comparison

Source truth is the user's four annotated screenshots and comments in this conversation. Before captures from the selected local page are saved below. The comments authorize the layout/content differences; matching the rejected sections exactly is not the target.

| Surface | Before | After | Combined comparison |
| --- | --- | --- | --- |
| About and toolkit | [Before](docs/screenshots/revision-2/before-about.jpg) | [After](docs/screenshots/revision-2/after-about.jpg) | [Side by side](docs/screenshots/revision-2/comparison-about.jpg) |
| Experience | [Before](docs/screenshots/revision-2/before-experience.jpg) | [After](docs/screenshots/revision-2/after-experience.jpg) | [Side by side](docs/screenshots/revision-2/comparison-experience.jpg) |
| Contact banner | [Before, lower section](docs/screenshots/revision-2/before-experience.jpg) | [After](docs/screenshots/revision-2/after-contact.jpg) | [Side by side](docs/screenshots/revision-2/comparison-contact.jpg) |

Desktop before/after captures use the same light theme, route anchors, and browser-reported 1414 × 719 CSS viewport. The browser capture provider returns a 1326 × 719 content image for both; comparison boards display both at the same width and preserve their image aspect ratios. Pixel measurements are not inferred across that provider discrepancy. The full section captures were inspected at readable size for typography, icons, spacing, copy, and the envelope's transparency. The combined boards were then inspected for section composition and hierarchy. This was one revision pass, with no remaining P0/P1/P2 findings.

**Fidelity surfaces:** DM Sans and monospace labels remain consistent with the notebook design. Spacing deliberately expands Experience to accommodate useful work summaries. Cream, teal, and charcoal tokens are retained; the contact panel uses a fixed deep teal surface with readable cream text and focus outline in both themes. Toolkit icons use the existing library; the envelope remains a real raster asset with clean transparency. Copy comes from the existing work history without adding metrics or availability claims.

**Verification:** lint and the production build passed; all three existing contact tests passed. The new About and Contact calls to action were clicked and reached their routes. All four revised sections were checked at 320px, 390px, 768px, 1024px, and the desktop viewport; no horizontal document overflow or broken images was observed. Dark Experience was visually inspected, and the local page was returned to light mode. The final browser console contained no error/warning entries. The About route still renders and has no mobile overflow.

Additional evidence: [phone About](docs/screenshots/revision-2/mobile-about.jpg), [phone toolkit](docs/screenshots/revision-2/mobile-tech-stack.jpg), [phone Experience](docs/screenshots/revision-2/mobile-experience.jpg), [phone banner](docs/screenshots/revision-2/mobile-contact.jpg), [320px banner](docs/screenshots/revision-2/contact-320.jpg), [dark Experience](docs/screenshots/revision-2/experience-dark.jpg).

No new integration work was included. Live EmailJS delivery and performance benchmarking remain outside this revision's verification scope. The earlier report below records the initial design implementation; its homepage images are historical evidence.

---

## Findings

No actionable P0/P1/P2 findings remain in the five implemented page designs. This is a visual and functional acceptance pass, not a claim of pixel identity or a performance audit.

## Source and capture evidence

Source visual truth:

- Home: `/Users/neeraj/neeraj/portfolio/landing-page-design-2026-10-10/landing-page-desktop-v1.png` — 836 × 1881 pixels.
- Projects: `/Users/neeraj/neeraj/portfolio/page-designs-2026-10-10/projects-desktop-v1.png` — 1024 × 1536 pixels.
- Blog: `/Users/neeraj/neeraj/portfolio/page-designs-2026-10-10/blog-desktop-v1.png` — 1374 × 1145 pixels.
- About: `/Users/neeraj/neeraj/portfolio/page-designs-2026-10-10/about-desktop-v1.png` — 992 × 1586 pixels.
- Contact: `/Users/neeraj/neeraj/portfolio/page-designs-2026-10-10/contact-desktop-v1.png` — 1487 × 1058 pixels.

These raster mockups do not encode a browser CSS viewport or device scale. They depict desktop layouts despite differing export widths. Implementation captures use a 1440 × 1000 CSS viewport, devicePixelRatio 1, with 1440 × 1000 image output. Both sides are scaled to equal display widths in the comparison boards, without stretching either image. The smaller mockup export widths are not treated as mobile breakpoints.

State: light theme, matching route, initial/default content; Contact has empty fields. The contact action differs intentionally because the local build lacks EmailJS configuration. Dark mode and narrower widths are additional resilience checks because the source does not provide those states.

| Page | Implementation screenshot | Full-page comparison | Focused comparison |
| --- | --- | --- | --- |
| Home | [Desktop](docs/screenshots/home-final-0.png) | [Full composition](docs/screenshots/home-comparison-final.png) | [Sidebar, hero, typography](docs/screenshots/home-focus-final.png) |
| Projects | [Desktop](docs/screenshots/projects-final-0.png) | [Full composition](docs/screenshots/projects-comparison-final.png) | [Introduction and project rows](docs/screenshots/projects-focus-final.png) |
| Blog | [Desktop](docs/screenshots/blog-final-0.png) | [Full composition](docs/screenshots/blog-comparison-final.png) | [Introduction and feature](docs/screenshots/blog-focus-final.png) |
| About | [Desktop](docs/screenshots/about-final-0.png) | [Full composition](docs/screenshots/about-comparison-final.png) | [Introduction and notebook](docs/screenshots/about-focus-final.png) |
| Contact | [Desktop](docs/screenshots/contact-final-0.png) | [Full composition](docs/screenshots/contact-comparison-final.png) | [Form, illustration, contact details](docs/screenshots/contact-focus-final.png) |

Full-page browser screenshots produced inconsistent scaling, so the final full-view boards use normal viewport captures taken at recorded scroll positions. The HTML comparison boards clip repeated sticky sidebar regions and overlapping final frames; they do not redraw application content. [Capture manifest](docs/screenshots/capture-manifest.json) records the offsets and page heights. Raw sequences, source copies, intermediate captures, and comparison HTML remain in `/Users/neeraj/neeraj/portfolio/notebook-qa-2026-10-10/`. Full and focused boards were opened and inspected together with their source design before acceptance.

## Comparison history

1. **Blocked: desktop spacing and imagery.** The Blog introduction was too tall and displaced the featured article (P2). Contact text was restricted to the form column and wrapped prematurely (P2). The shared identity typography and handwritten note did not match the source hierarchy (P2). The home rendering illustration occupied too much vertical space (P2). Initial evidence: `blog-comparison-v1.png`, `contact-comparison-v1.png`, and the first desktop captures in the raw evidence directory.
2. **Desktop fixes and recapture.** Reduced the Blog introduction art to 180px with a dedicated grid; moved the Contact lead above the form grid; used the matching open-letter illustration; increased identity typography; applied Caveat to handwritten notes; limited the rendering art to 375px. The final full and focused comparison boards linked above show these corrections. The source's cream page, thin dividers, orange links, teal labels, and section order are retained.
3. **Blocked: tablet Contact overlap (P2).** A 768px viewport kept a narrow two-column contact grid and let the illustration intrude into the introduction. The compact navigation also needed more room at 320px.
4. **Responsive fixes and recapture.** Switched the compact layout breakpoint to 900px, stacked the Contact form and details, removed decorative navigation icons at the narrowest width, and constrained the Contact description at intermediate desktop widths. Post-fix evidence: [Contact at 768px](docs/screenshots/contact-768-final.png), [Contact at 1024px](docs/screenshots/contact-1024-final.png), [Home at 320px](docs/screenshots/home-320-final.png), and [About at 768px](docs/screenshots/about-768-final.png). No clipped navigation or overlapping Contact content remains in these captures.

## Required fidelity surfaces

- **Fonts and typography:** DM Sans supplies the rounded, heavy display hierarchy and clear body text; monospace labels and Caveat notes match the notebook treatment. Focused comparisons checked heading wraps, body line height, sidebar name, field labels, and small navigation text. Exact glyph contours differ from the unidentified raster reference font, an acceptable P3 distinction.
- **Spacing and layout rhythm:** Shared sidebar, top bar, content column, horizontal dividers, project image/text rows, About sections, and Contact columns match the reference structure. The responsive layout stacks deliberately below 900px. Home project images use an uncropped 16:9 presentation, making the full page slightly taller than the source.
- **Colors and visual tokens:** Warm cream, charcoal, teal, and red-orange remain consistent through the five routes. Inputs, subtle borders, active navigation, hover/focus, and error states use shared tokens. Dark mode has readable page surfaces and controls; it is an additional state rather than a reference match.
- **Image quality and asset fidelity:** All illustrated subjects are present as raster assets generated from the chosen art direction; actual Lyriks and Greattr screenshots are retained. Reviewed placement, subject, scale, sharpness, alpha edges, and background integration in the browser. No CSS drawings or handmade SVG replacements were used. Standard UI icons use Lucide. Generated strokes and small illustration details differ from the mockup but preserve the subjects and palette.
- **Copy and content:** Existing article bodies, project destinations, résumé data, public profile links, and API implementations remain. Project titles are shortened and reordered to match the selected presentation. Blog is the consistent navigation label. The mock's RSS link is omitted because the repository has no feed route. No invented testimonials, availability promises, or project metrics were added. Contact explains the real sending mode instead of displaying a false success.

## Functional verification

- `npm run lint` — passed.
- `npm test` — 3 passed, 0 failed: valid/trimmed values, invalid and boundary values, mailto encoding. Node emits a non-failing module-type warning for importing TypeScript directly.
- `npm run build` — passed, including TypeScript and generation of 20 routes.
- Local HTTP checks — Home, Projects, Blog, About, Contact, all three posts, résumé, privacy, editorial policy, both APIs, sitemap, and llms.txt returned 200; an unknown route returned 404.
- Browser navigation — primary links, home feature to article, Back to Blog, project destinations, and résumé page checked. The skip link activated the focusable main region.
- Contact — invalid fields show associated errors and focus the first invalid field; a valid draft exposes an encoded mailto link; clipboard copying reports success. No test enquiry was sent. [Draft state](docs/screenshots/contact-draft.png).
- Theme — toggled dark/light, checked navigation persistence, restored light. [Dark Contact](docs/screenshots/contact-dark.png).
- Responsive checks — all five pages inspected at 320px, 390px, 768px and desktop widths; no horizontal document overflow or broken images in DOM checks. The final Contact fixes were rechecked at 768px and 1024px; final compact navigation was rechecked at 320px.
- Browser console — no captured error or warning entries during the final local navigation checks.

## Open questions and limits

Live EmailJS delivery, provider failure responses, and success after actual delivery were not exercised because the local EmailJS settings are absent. The existing template keys and integration were retained. The email-app fallback is verified without opening or sending a message. External project services and résumé PDF availability are outside the local route acceptance check.

Performance benchmarking is deferred as requested. This pass does not claim a Lighthouse score, cross-browser certification, or a complete accessibility audit. Keyboard activation, visible focus/error states, labels, theme behavior, and viewport resilience were checked.

## Follow-up polish

- P3: Exact font contours and hand-drawn stroke details can be tuned after review if desired.
- P3: Home project image proportions create slightly more vertical space than the mockup; retain readable, uncropped images unless a tighter crop is preferred.

## Implementation checklist

- [x] Build all five approved page compositions with shared components.
- [x] Place the generated illustrations and retain real project screenshots.
- [x] Resolve desktop and tablet P2 findings and compare revised captures.
- [x] Verify primary navigation, theme, contact draft/error states, and retained routes.
- [x] Pass lint, contact tests, production build, and diff whitespace checks.
- [x] Save visual evidence and document remaining integration/performance limits.
