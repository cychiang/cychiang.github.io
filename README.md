# cychiang.github.io

My personal site: slide decks and notes about platform engineering. Decks are
written in Markdown with [Slidev](https://sli.dev), notes are Markdown files
written in [OpenKnowledge](https://openknowledge.ai), and the homepage is built
with [Astro](https://astro.build). Pushing to `main` publishes everything to
GitHub Pages.

## Quick start

Requires Node.js 22.18 or newer and [pnpm](https://pnpm.io) (`corepack enable`
installs the version pinned in `package.json`).

```bash
pnpm install
pnpm dev                     # homepage at http://localhost:4321
pnpm deck 2026-hello-world   # one deck at http://localhost:3030
```

## Add a deck

```bash
pnpm new:deck 2026-my-talk "My talk title"
pnpm deck 2026-my-talk
```

Write the slides in `decks/2026-my-talk/slides.md`, set `card.draft: false` when
it is ready, and push. The homepage card is generated from the deck's
headmatter.

## Write a post

Open the repository in OpenKnowledge on the `writing` branch and create a
document from the "Post" template, or run `pnpm new:post 2026-my-note "Title"`.
Set `draft: false` when it is ready and merge `writing` into `main`.

## Build

```bash
pnpm check     # validate decks and types
pnpm build     # homepage and every published deck into dist/
pnpm preview   # serve dist/ locally
```

The full conventions, for people and coding agents alike, are in
[AGENTS.md](AGENTS.md). The visual language (tokens, slide theme, diagram
templates) is in [design/README.md](design/README.md); preview every layout
with `pnpm design:preview`.

The site that lived here until 2013 is kept on the `legacy-main` branch.
