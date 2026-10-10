---
name: terminal-design
description: Change or audit the look of this site, its Slidev theme or its Mermaid diagrams (colours, typeface, spacing, components, layouts). Use before any visual change and when reviewing a page, deck or diagram for consistency with the terminal design system.
---

# Terminal design system

Everything visible in this repository follows one design system. The rules
are in `design/README.md` (normative) and the values in `design/tokens.ts`
(the only source). Read both before changing anything visual. This skill is
the procedure; it does not repeat the rules.

## Where things live

| Change | Edit |
| --- | --- |
| A colour, the typeface, weights, radius, border, the default prompt | `design/tokens.ts`, then `pnpm design:build` |
| Homepage layout or a component | `src/components/*.astro`, `src/layouts/Base.astro`, `src/styles/global.css` (layout values only) |
| Slide typography, a layout, a component, code colours | `design/slidev-theme/styles/*.css`, `layouts/`, `components/`, `setup/shiki.ts` |
| Diagram look or a new diagram kind | `design/mermaid.ts` (`themeCSS`), `design/templates/diagrams/` |
| The link back to the homepage inside decks | `slidev-addon-site/` |
| Link preview (Open Graph) images | `src/og/render.ts`; check `dist/og/*.png` after `pnpm build` |

Never edit `design/generated/` or `public/favicon.svg` by hand; they are
written by `pnpm design:build`.

## Procedure for a style change

1. Make the change at the source above. A colour or font change is a token
   change; do not patch a component with a raw value.
2. `pnpm design:build` if tokens changed, then `pnpm design:check`.
3. Look at every surface in light and dark:
   - homepage and a post: `pnpm build && pnpm preview` at 390px, 768px and
     1920px; no horizontal page scroll; the post column centred on wide
     screens
   - every slide layout and diagram template: `pnpm design:preview`
     (the specimen deck, `design/templates/deck/slides.md`)
   - a real deck: `pnpm deck 2026-hello-world`
   Take screenshots when a browser tool is available; compare both modes.
4. Search for values that escaped the tokens and remove them:
   `grep -rnE "#[0-9a-fA-F]{6}|font-family: *['\"]" src design/slidev-theme slidev-addon-site`
   (only `design/tokens.ts` and generated files may match).
5. Update `design/README.md` (colour table, patterns, principles) and
   `AGENTS.md` if a rule changed. Add anything new to the specimen deck.
6. `pnpm check && pnpm build`, then commit everything together.

## Changing the typeface

Install the `@fontsource` package (`pnpm add -w @fontsource-variable/<name>`),
remove the old one, point `design/fonts.css` at the new files, set
`font.family` (the name fontsource registers, often with a "Variable"
suffix) and `font.stack` in `design/tokens.ts`, and set the three `fonts`
defaults in `design/slidev-theme/package.json` to the same name. Monospace
only; keep `font-variant-ligatures: none`. Then follow the procedure.

## Adding to the slide theme

- A layout: `design/slidev-theme/layouts/<name>.vue` wrapping
  `<div class="slidev-layout <name>">`, rules in `styles/layouts.css`, a
  slide in the specimen deck, a line in `design/README.md` "Slides".
- A component: `design/slidev-theme/components/<Name>.vue` using tokens
  only; show it in the specimen deck; document it.
- A prop that may be `false` (like the cover's `prompt`): declare it with
  `type: null`, never a Boolean type, or Vue turns an absent prop into
  `false`.
- A diagram kind: a template in `design/templates/diagrams/` with the rules
  in its presenter note, a `src:` import in the specimen deck, `themeCSS`
  rules in `design/mermaid.ts` for its SVG classes, a row in the README
  table. Mermaid 12 ignores `flowchart.curve`; do not promise edge shapes.

## Audit checklist

Run through "Review checklist" in `design/README.md`. The failures that
happen most: a second typeface or weight, a raw colour, colour used as
decoration, a shadow or gradient, a second corner radius, text that fails
contrast in one mode, animation other than the homepage cursor, a deck
without `theme: terminal`, a diagram with more than two semantic classes.
