---
name: deck-authoring
description: Create or edit a slide deck in decks/ (a talk, case study, note or open-source deck) - headmatter, the prompt line, layouts, components, diagrams from the templates, drafts and publishing. Use whenever slides are to be written or changed in this repository.
---

# Writing a deck

Decks are Slidev presentations in `decks/<slug>/slides.md`, published at
`/decks/<slug>/` and listed on the homepage from their headmatter. Read
`AGENTS.md` "Adding a deck" for the full rules; read the Slidev skill
(`.agents/skills/slidev/SKILL.md`) for Slidev syntax. This skill is the
working order.

## Create

```bash
pnpm new:deck 2026-short-title "Deck title"   # <year>-<kebab>, becomes the URL
pnpm deck 2026-short-title                     # dev server, http://localhost:3030
```

Never rename a published deck's folder; links would break. In OpenKnowledge
the "Deck (slides.md)" template gives the same headmatter; create the file
as `decks/<slug>/slides.md`.

## Headmatter

```yaml
---
theme: terminal           # required
title: Deck title
info: |
  One or two plain sentences; shown under the card on the homepage.
routerMode: hash          # required (GitHub Pages cannot rewrite URLs)
themeConfig:              # optional: the prompt line on the cover and in <Prompt>
  prompt: { user: cychiang, host: kubecon, path: "~" }
card:
  date: 2026-09-12        # YYYY-MM-DD; the year must match the folder name
  type: talk              # talk | case-study | note | open-source
  event: Meetup, Stockholm   # optional
  tags: [crossplane]      # optional
  draft: true             # false to publish
  links: { video: https://…, repo: https://… }   # optional
---
```

The first slide is the cover. Its own frontmatter may set
`prompt: { user, host, path, command }`, `prompt: "command"` or
`prompt: false`. Default: `cychiang@github.io:~$ open <slug>`.

## Slides

- Layouts: `cover`, `default`, `section`, `diagram`, `end`, `center`,
  `two-cols` (`::right::`), `two-cols-header`, `statement`, `fact`, `quote`.
  See them all: `pnpm design:preview`.
- Components: `<Prompt>cmd</Prompt>` (optional `user`, `host`, `path`),
  `<Pane title="…" status="…">…</Pane>`.
- Emphasis: `**strong**`, or a colour class on a span: `.ok`, `.warn`,
  `.fail`, `.soft`. Nothing else; no inline styles, no UnoCSS colours.
- One idea per slide, one-line heading, at most eight body lines or twelve
  code lines. Split rather than shrink. Presenter notes go in an HTML
  comment at the end of the slide (never write `-->` inside one).
- Images next to the deck (`decks/<slug>/images/`), relative paths. Long
  decks split with `src: ./pages/part.md`.

## Diagrams

Copy the Mermaid block from the matching template and keep its rules (in
the template's note):

| Kind | Template |
| --- | --- |
| process or request flow | `design/templates/diagrams/flowchart.md` |
| components in boundaries | `design/templates/diagrams/architecture.md` |
| who talks to whom | `design/templates/diagrams/sequence.md` |
| lifecycle of one thing | `design/templates/diagrams/state.md` |

Use `layout: diagram`. Left to right; about eight nodes or messages; classes
only for meaning (`:::focus`, `:::ok`, `:::warn`, `:::fail`, `:::ext`,
`:::store`); label one edge of a fan-out.

## Content rules

Nothing confidential from an employer or client: no internal diagrams,
data, names or screenshots; restate the problem in general terms. Back each
claim with something concrete. Sentence case; English.

## Publish

1. Set `card.draft: false`.
2. `pnpm check` (validates the deck) and `pnpm build`.
3. Open `pnpm preview`, check the card on the homepage and the deck in
   light and dark, and that "All decks" leads back.
4. Commit. Pushing `main` publishes; the live site may show the previous
   build for up to ten minutes (hard-reload before concluding otherwise).
