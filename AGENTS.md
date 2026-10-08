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
src/components/            DeckWall, DeckCard and Prompt
src/layouts/Base.astro     html shell, header, footer
src/styles/                global.css, and theme.css which selects the theme
src/themes/                site themes, one CSS file each
scripts/lib/decks.ts       deck discovery and validation, shared by everything
scripts/                   new-deck, deck (dev server), check-decks, build-decks
scripts/templates/         the template a new deck starts from
slidev-addon-site/         local Slidev addon applied to every deck (link home)
pnpm-workspace.yaml        pnpm settings: overrides and allowed install scripts
.github/workflows/         build on pull requests, deploy on push to main
```

## Toolchain

- **pnpm** is the package manager. Do not use npm or yarn, and do not commit
  a `package-lock.json`. The pnpm version is pinned by `packageManager` in
  `package.json`; `corepack enable` makes it available.
- **TypeScript** everywhere: the Astro site, `astro.config.ts`, and every
  script. Do not add `.js` or `.mjs` source files.
- Scripts in `scripts/` are run directly by Node (`node scripts/x.ts`), with
  no build step. Node strips the types but cannot compile TypeScript-only
  runtime features, so use erasable syntax only: no enums, namespaces or
  parameter properties; use `import type` for types; write relative imports
  with the `.ts` extension. `tsconfig.json` enforces this
  (`erasableSyntaxOnly`), and `pnpm check` type-checks the scripts too.

Managed by other tools. Do not edit by hand:

- `.agents/`, `.claude/`, `.cortex/`, `skills-lock.json`: agent skills
  installed with the `skills` CLI. Update them with that CLI only.
- `pnpm-lock.yaml`: change it through `pnpm install` / `pnpm add`.

The branch `legacy-main` holds the site that lived here until 2013. Leave it
alone.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm install` | Install dependencies. |
| `pnpm dev` | Homepage dev server (http://localhost:4321). Drafts are shown. |
| `pnpm deck <slug>` | Slidev dev server for one deck (http://localhost:3030). |
| `pnpm new:deck <slug> "Title"` | Create a deck from the template, as a draft. |
| `pnpm check` | Validate every deck, then type-check the site and scripts. |
| `pnpm build` | Build the homepage, then every published deck, into `dist/`. |
| `pnpm preview` | Serve `dist/` exactly as it will be published. |

Deck links on the homepage only work after `pnpm build`, because decks are
built by Slidev, not by the Astro dev server. To review the whole site, run
`pnpm build && pnpm preview`.

## Skills and docs to use

- **Slidev**: read `.agents/skills/slidev/SKILL.md` before writing or editing
  slides, and the matching file in `.agents/skills/slidev/references/` for the
  feature in question (layouts, animations, code blocks, diagrams, export).
  Prefer what the skill documents over memory.
- **Slidev MCP**: while `pnpm deck <slug>` is running, slide-level tools
  are available at `http://localhost:3030/__mcp`. Use them for inserting,
  moving and removing slides. See `references/tool-mcp.md`.
- **Astro**: the Astro docs MCP server is configured in `.mcp.json`
  (`astro-docs`). Check it before using an Astro API. This repo is on Astro 7.

## Adding a deck

1. Pick the slug: `<year>-<short-title>`, lowercase, hyphenated, for example
   `2026-building-a-provider`. The slug is the public URL. **Never rename a
   deck folder after it has been published**; links people have shared would
   break.
2. Run `pnpm new:deck <slug> "Deck title"`.
3. Fill in the headmatter (see below) and write the slides in
   `decks/<slug>/slides.md`. Preview with `pnpm deck <slug>`.
4. Put images next to the deck (`decks/<slug>/images/…`) and reference them
   with relative paths. Split long decks with `src:` imports into
   `decks/<slug>/pages/`.
5. When it is ready to publish, set `card.draft: false`.
6. Run `pnpm check && pnpm build`. Both must pass.
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

`pnpm check` enforces these, and the build refuses a deck that breaks them:

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
pnpm add -D playwright-chromium
pnpm exec playwright install chromium
pnpm exec slidev export decks/<slug>/slides.md --format png --range 1 --output decks/<slug>/cover
```

Check where Slidev wrote the PNG, move it to `decks/<slug>/cover.png`, and
commit only that file; revert the `playwright-chromium` dependency afterwards.
These steps have not been run in this repository yet. If they need adjusting,
correct this section in the same commit.

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
- **A new deck type**: add it to `DECK_TYPES` in `scripts/lib/decks.ts` and
  give it a label in `typeLabels` in `src/site.config.ts`.
- **A new field on the card**: add it to the `Deck` interface and `readDeck()`
  in `scripts/lib/decks.ts`, add it to the loader and schema in
  `src/content.config.ts`, then render it in `DeckCard.astro`. Document it in
  the headmatter section above.

### Site style

The site has a terminal look, and new pages and components must keep it:

- One monospace typeface for everything (IBM Plex Mono). No second family.
- Each section starts with a prompt line, `<Prompt command="…" />`, naming
  the command whose "output" follows (`cat about.txt`, `ls decks/`). The
  prompt is decoration and is hidden from screen readers, so every section
  also needs a real heading (it may be `visually-hidden`) or an `aria-label`.
  The command should be a plausible one for the content; do not invent flags
  for jokes.
- Decks are panes: path in the title bar, slide in the body, date and length
  in the status line. Borders are 1px; corners use `--radius-slide`.
- Colour carries the meaning it has in a terminal: `--color-prompt` (green)
  for the prompt and cursor, `--color-accent` (blue) for anything that can be
  opened, `--color-flag` (yellow) for warnings such as drafts. Do not use
  colour as decoration.
- Lowercase for interface labels that mimic commands, paths and flags
  (`github`, `--type all`). Sentence case for prose and headings.
- The blinking cursor in the first empty slot is the only animation. Do not
  add more, and respect `prefers-reduced-motion`.

### Changing the site theme

A site theme is one CSS file in `src/themes/` that defines the custom
properties below for light and dark. Components use these properties and no
other colours, fonts or radii.

```
--color-table  --color-slide  --color-ink     --color-ink-soft
--color-line   --color-accent --color-on-accent
--color-prompt --color-flag
--font-display --font-body    --weight-regular --weight-strong
--radius-slide --wall-gap     --page-gutter    --page-width
```

To change colours or the typeface, edit `src/themes/terminal.css`, or copy it
to a new file and point the import in `src/styles/theme.css` at it. A
different typeface needs its `@fontsource` package installed and imported at
the top of the theme file; keep it monospace. Never put raw colour or font
values in components; add a property to the theme contract instead, and
update this list.

### What every deck gets automatically

`slidev-addon-site/` is a local Slidev addon. The root `package.json` lists it
under `slidev.addons`, so Slidev loads it for every deck with nothing to add
to a deck's headmatter. It provides the way back to the homepage:

- `global-top.vue`: an "All decks" link in the top-left corner of every slide.
  It is hidden in presenter view, in exports and when a deck is embedded.
- `custom-nav-controls.vue`: a home button in Slidev's control bar.
- `site-home.ts`: works out the homepage URL from the deck's base path.

A deck must always offer a way back to the homepage; do not remove these
without replacing them. Put anything else that should appear on every deck
(a footer, a logo) in this addon, not in individual decks. A deck can still
add its own `global-top.vue`; Slidev renders both.

### Slidev themes

Each deck chooses its own Slidev theme with `theme:` in its headmatter. Theme
packages are installed once at the repository root, for example
`pnpm add @slidev/theme-seriph`. A theme that is not installed makes the CI
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

- `pnpm build` runs `astro build` (homepage into `dist/`) and then
  `scripts/build-decks.ts` (each published deck into `dist/decks/<slug>/`).
- The workflow passes `SITE_URL` and `BASE_PATH` from
  `actions/configure-pages`, so the site works at a domain root or under a
  sub-path. Always build internal links from `import.meta.env.BASE_URL` in
  Astro and from `withBase()` in scripts. Never hard-code a leading `/`.
- The repository's Pages source must be set to "GitHub Actions".
- After a deploy, a browser can keep showing the previous build for up to ten
  minutes, and a deck that was already open can fail to load further slides.
  Hard-reload (Cmd+Shift+R) before concluding that a change did not work.

### Dependencies

- Node.js 22.18 or newer (`.nvmrc`), because scripts rely on Node running
  TypeScript directly.
- Add packages with `pnpm add <name>` (or `pnpm add -D`). pnpm holds back
  versions published in the last few days; prefer a slightly older version
  over adding entries to `minimumReleaseAgeExclude`.
- pnpm blocks dependency install scripts. If a new dependency needs one, add
  it to `allowBuilds` in `pnpm-workspace.yaml` after checking what it runs.
- Dependabot opens weekly update pull requests. Merge them only when the
  workflow is green.
- `pnpm-workspace.yaml` has an `overrides` entry pinning `magic-string` 1.x
  to `1.4.2`. Version 1.4.3 breaks every Slidev build through UnoCSS
  ([unocss#5373](https://github.com/unocss/unocss/issues/5373),
  [slidev#2768](https://github.com/slidevjs/slidev/issues/2768)). Remove the
  override once a fixed UnoCSS is released, and confirm with `pnpm build`.

## Before you finish

- `pnpm check` and `pnpm build` both pass.
- For visual changes, look at the result with `pnpm preview` in light and
  dark, at phone and desktop widths.
- Navigation works both ways: from the homepage into a deck, and from any
  slide back to the homepage.
- No files changed under `.agents/`, `.claude/`, `.cortex/`, or in
  `skills-lock.json`, unless the task was to update skills.
- This file still describes the repository. If you changed a convention,
  update it in the same commit.
