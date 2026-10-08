# AGENTS.md

How this repository is organised and how to change it. Written for coding
agents and for the owner. Follow it when adding decks, changing the homepage, or
touching the build.

## What this is

A personal site for Chuan-Yen Chiang's experience and talks. It has two parts
that are built separately and published together:

- **Decks**: each one is a [Slidev](https://sli.dev) presentation in
  `decks/<slug>/slides.md`, published at `/decks/<slug>/`.
- **Homepage**: an [Astro](https://astro.build) site in `src/` that shows every
  published deck as a card on a wall. Cards are generated from each deck's
  headmatter. Nothing about a deck is written twice.

## Layout

```
decks/<slug>/slides.md     one Slidev deck per folder (the content)
decks/<slug>/cover.png     optional cover image for the homepage card
src/site.config.ts         site name, homepage copy, header links, type labels
src/content.config.ts      the `decks` content collection (reads decks/)
src/pages/                 Astro pages (index, 404)
src/components/            DeckWall and DeckCard
src/layouts/Base.astro     html shell, header, footer
src/styles/                global.css, and theme.css which selects the theme
src/themes/                site themes, one CSS file each
scripts/lib/decks.mjs      deck discovery and validation, shared by everything
scripts/                   new-deck, deck (dev server), check-decks, build-decks
scripts/templates/         the template a new deck starts from
.github/workflows/         build on pull requests, deploy on push to main
```

Managed by other tools. Do not edit by hand:

- `.agents/`, `.claude/`, `.cortex/`, `skills-lock.json`: agent skills
  installed with the `skills` CLI. Update them with that CLI only.
- `package-lock.json`: change it through `npm install`.

The branch `legacy-main` holds the site that lived here until 2013. Leave it
alone.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Homepage dev server (http://localhost:4321). Drafts are shown. |
| `npm run deck -- <slug>` | Slidev dev server for one deck (http://localhost:3030). |
| `npm run new:deck -- <slug> "Title"` | Create a deck from the template, as a draft. |
| `npm run check` | Validate every deck, then type-check the Astro site. |
| `npm run build` | Build the homepage, then every published deck, into `dist/`. |
| `npm run preview` | Serve `dist/` exactly as it will be published. |

Deck links on the homepage only work after `npm run build`, because decks are
built by Slidev, not by the Astro dev server. To review the whole site, run
`npm run build && npm run preview`.

## Skills and docs to use

- **Slidev**: read `.agents/skills/slidev/SKILL.md` before writing or editing
  slides, and the matching file in `.agents/skills/slidev/references/` for the
  feature in question (layouts, animations, code blocks, diagrams, export).
  Prefer what the skill documents over memory.
- **Slidev MCP**: while `npm run deck -- <slug>` is running, slide-level tools
  are available at `http://localhost:3030/__mcp`. Use them for inserting,
  moving and removing slides. See `references/tool-mcp.md`.
- **Astro**: the Astro docs MCP server is configured in `.mcp.json`
  (`astro-docs`). Check it before using an Astro API. This repo is on Astro 7.

## Adding a deck

1. Pick the slug: `<year>-<short-title>`, lowercase, hyphenated, for example
   `2026-building-a-provider`. The slug is the public URL. **Never rename a
   deck folder after it has been published**; links people have shared would
   break.
2. Run `npm run new:deck -- <slug> "Deck title"`.
3. Fill in the headmatter (see below) and write the slides in
   `decks/<slug>/slides.md`. Preview with `npm run deck -- <slug>`.
4. Put images next to the deck (`decks/<slug>/images/…`) and reference them
   with relative paths. Split long decks with `src:` imports into
   `decks/<slug>/pages/`.
5. When it is ready to publish, set `card.draft: false`.
6. Run `npm run check && npm run build`. Both must pass.
7. Commit. Pushing to `main` publishes it.

### Headmatter

The first frontmatter block of `slides.md` configures the deck for Slidev and
describes it for the homepage.

```yaml
---
theme: default            # Slidev theme (see "Slidev themes")
title: Building a provider from scratch
info: |
  One or two plain sentences. Shown under the card on the homepage.
routerMode: hash          # required, see "Deck rules"
card:
  date: 2026-09-12        # when it was given or written, YYYY-MM-DD
  type: talk              # talk | case-study | note | open-source
  event: Meetup name, Stockholm   # optional; where it was given
  tags: [crossplane, platform]    # optional
  draft: false            # true keeps it off the published site
  links:                  # optional; shown as links under the card
    video: https://…
    repo: https://…
    post: https://…
---
```

`title` and `info` are standard Slidev fields. Everything under `card:` is read
only by this site.

### Deck rules

`npm run check` enforces these, and the build refuses a deck that breaks them:

- The folder name matches `<year>-<short-title>`, and the year equals the year
  of `card.date`.
- `title` is set.
- `card.date` is a valid `YYYY-MM-DD` date.
- `card.type` is one of the allowed types.
- `routerMode: hash` is set. GitHub Pages cannot rewrite URLs, so without hash
  routing a reload or a shared link to a slide returns 404.

### Cover images

A card shows a typeset cover (the deck's title) by default. To use an image
instead, add `decks/<slug>/cover.png` (or `.jpg`, `.webp`) at 16:9, at least
960 px wide. One way to make it from the first slide:

```bash
npm install --no-save playwright-chromium
npx slidev export decks/<slug>/slides.md --format png --range 1 --output decks/<slug>/cover
```

Check where Slidev wrote the PNG, move it to `decks/<slug>/cover.png`, and
commit only that file.

### Content rules

- One idea per slide. A deck is not an article; link out for long arguments.
- Back each claim with something concrete: a situation, a number, a failure.
  State the trade-off and when the opposite choice would be right.
- **Nothing confidential.** No internal diagrams, data, names or screenshots
  from an employer or client. Rewrite the problem in general terms.
- Sentence case for titles and headings. Site and deck language is English
  unless the owner says otherwise.

## Changing the homepage

- **Words and links**: edit `src/site.config.ts`. Do not hard-code copy in
  components.
- **Card contents**: `src/components/DeckCard.astro`.
- **Wall layout, filters, empty slots**: `src/components/DeckWall.astro`.
  Filter buttons appear on their own once decks of more than one type exist.
  The dashed empty slots disappear once there are three decks.
- **A new deck type**: add it to `DECK_TYPES` in `scripts/lib/decks.mjs` and
  give it a label in `typeLabels` in `src/site.config.ts`.
- **A new field on the card**: read it in `readDeck()` in
  `scripts/lib/decks.mjs`, add it to the loader and schema in
  `src/content.config.ts`, then render it in `DeckCard.astro`. Document it in
  the headmatter section above.

### Changing the site theme

A site theme is one CSS file in `src/themes/` that defines the custom
properties below for light and dark. Components use these properties and no
other colours, fonts or radii.

```
--color-table  --color-slide  --color-ink  --color-ink-soft
--color-line   --color-accent --color-on-accent
--font-display --font-body    --weight-regular --weight-strong
--radius-slide --wall-gap     --page-gutter    --page-width
```

To restyle the site, copy `src/themes/lightbox.css` to a new file, change the
values, and point the import in `src/styles/theme.css` at it. If the theme
uses a different typeface, install its `@fontsource` package and import it at
the top of the theme file. Never put raw colour or font values in components;
add a property to the theme contract instead, and update this list.

### Slidev themes

Each deck chooses its own Slidev theme with `theme:` in its headmatter. Theme
packages are installed once at the repository root, for example
`npm install @slidev/theme-seriph`. A theme that is not installed makes the CI
build fail, so install it in the same commit that first uses it.

## Adding other kinds of content

Articles are not set up yet. When they are needed, keep the same shape as
decks: Markdown in a top-level `posts/` folder, a `posts` collection in
`src/content.config.ts` using Astro's `glob()` loader, and pages under
`src/pages/posts/`. Add the build output to the same `dist/`, and extend this
file with the rules for writing one.

## Build and deployment

`.github/workflows/deploy.yml` runs on every pull request (check and build)
and on every push to `main` (check, build, deploy to GitHub Pages).

- `npm run build` runs `astro build` (homepage into `dist/`) and then
  `scripts/build-decks.mjs` (each published deck into `dist/decks/<slug>/`).
- The workflow passes `SITE_URL` and `BASE_PATH` from
  `actions/configure-pages`, so the site works at a domain root or under a
  sub-path. Always build internal links from `import.meta.env.BASE_URL` in
  Astro and from `withBase()` in scripts. Never hard-code a leading `/`.
- The repository's Pages source must be set to "GitHub Actions".

### Dependencies

- Node.js 22.12 or newer (`.nvmrc`). Use npm.
- Dependabot opens weekly update pull requests. Merge them only when the
  workflow is green.
- `package.json` has an `overrides` entry pinning `magic-string` 1.x to
  `1.4.2`. Version 1.4.3 breaks every Slidev build through UnoCSS
  ([unocss#5373](https://github.com/unocss/unocss/issues/5373),
  [slidev#2768](https://github.com/slidevjs/slidev/issues/2768)). Remove the
  override once a fixed UnoCSS is released, and confirm with `npm run build`.

## Before you finish

- `npm run check` and `npm run build` both pass.
- For visual changes, look at the result with `npm run preview` in light and
  dark, at phone and desktop widths.
- No files changed under `.agents/`, `.claude/`, `.cortex/`, or in
  `skills-lock.json`, unless the task was to update skills.
- This file still describes the repository. If you changed a convention,
  update it in the same commit.
