# Design principles pass — 16 October 2026

## Direction
A personal engineering notebook for readers, collaborators and hiring teams. Keep Neeraj’s approved illustrations, cream/forest theme, concise copy and one blog action in the tall home hero. Make the surrounding interface disciplined and readable.

## Tokens
- Paper #f8f6f0; ink #20231f; muted ink #62645f; teal #087f7c; orange #c94023 for filled actions / #b9381f for text links; sage #e9f2ed. Keep the existing forest dark palette and use contrasting foregrounds for actions.
- DM Sans for interface and reading; Newsreader for the featured article; Caveat only for existing notebook annotations.
- Type roles: 13px metadata, 15px controls, 17px body, 20px lead, 24–28px cards, 32–40px section titles, 40–60px hero. Mobile body stays at least 16px.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px. Reading measures 60–70ch. Headings balanced, long links wrap.

## Layout
Left-aligned editorial content with a persistent navigation rail on desktop and compact navigation above content on mobile. Preserve the tall, two-column hero and its single CTA. Use open groups, consistent alignment and space rather than redundant borders.

```text
Desktop                         Mobile
[identity | page navigation]     [identity + navigation]
[nav      | copy       art ]     [hero copy]
[social   | blog action    ]     [blog action + art]
[         | project gallery]     [project gallery]
[         | toolkit groups ]     [toolkit groups]
[         | logo timeline  ]     [logo timeline]
[         | contact / about]     [contact / about]
[         | updates/footer ]     [updates / footer]
```

## Review of the plan before implementation
The approved cream, orange and notebook imagery are intentional; replacing them would conflict with the brief. Generic additions to remove: numbered project decoration, repeated all-cap kicker/heading pairs, borders around every section, identical card wrappers and scattered hover movement. Preserve meaningful boundaries on inputs, selected controls and the experience timeline. Use existing Radix/Button primitives. Use DM Sans for interface typography and retain the approved illustrations.

## Implementation and review
Consolidate tokens, layout and responsive rules; refine domain components without changing data or flows. Check public routes, desktop and narrow mobile, both themes, keyboard focus, forms, reduced motion, and image dimensions. Preserve RSS, newsletter, contact fallback, article diagrams/video and local editor behavior. Run lint, tests and production build.
