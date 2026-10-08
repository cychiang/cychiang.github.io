# cychiang.github.com

My personal site: a wall of slide decks about platform engineering. Each deck is
written in Markdown with [Slidev](https://sli.dev); the homepage is built with
[Astro](https://astro.build). Pushing to `main` publishes everything to GitHub
Pages.

## Quick start

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev                        # homepage at http://localhost:4321
npm run deck -- 2026-hello-world   # one deck at http://localhost:3030
```

## Add a deck

```bash
npm run new:deck -- 2026-my-talk "My talk title"
npm run deck -- 2026-my-talk
```

Write the slides in `decks/2026-my-talk/slides.md`, set `card.draft: false` when
it is ready, and push. The homepage card is generated from the deck's
headmatter.

## Build

```bash
npm run check     # validate decks and types
npm run build     # homepage and every published deck into dist/
npm run preview   # serve dist/ locally
```

The full conventions, for people and coding agents alike, are in
[AGENTS.md](AGENTS.md).

The site that lived here until 2013 is kept on the `legacy-main` branch.
