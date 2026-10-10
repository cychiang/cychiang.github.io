---
name: post-authoring
description: Create or edit a post (a Markdown note in posts/) for this site, including the OpenKnowledge writing branch flow, frontmatter rules, Mermaid diagrams and publishing. Use whenever a note, article or write-up is to be written or changed in this repository.
---

# Writing a post

Posts are Markdown files in `posts/<year>-<short-title>.md`, published at
`/posts/<slug>/` and listed on the homepage under `ls posts/`. The rules are
in `AGENTS.md` "Writing a post" and "Writing with OpenKnowledge"; the look is
in `design/README.md` "Posts". This skill is the working order.

## Where to write

- **OpenKnowledge** (the owner's editor): the repository is its project,
  checked out on the `writing` branch; it commits and pushes there by itself.
  Create a document from the "Post" template; the editor validates the
  frontmatter with `.ok/schemas/post.json`.
- **An agent in the repository**: branch from `main`, run
  `pnpm new:post <year>-<short-title> "Title"`, edit the file, open a pull
  request. Do not commit on `writing` while OpenKnowledge has it open.

## Frontmatter

```yaml
---
title: Why reconcile loops
description: One sentence, shown under the title on the homepage.
date: 2026-10-10        # the year must match the file name
tags: [crossplane]      # optional
draft: true             # false to publish
---
```

## Body

- Start with the claim, then earn it. One idea per section, headings in
  sentence case, paragraphs under 76 characters wide read best.
- Code in fenced blocks with a language; it is coloured with the design
  tokens. Inline code for names of things.
- Diagrams: a fenced `mermaid` block copied from the matching template in
  `design/templates/diagrams/` (flowchart, architecture, sequence, state),
  keeping that template's rules. They render in the browser with the same
  configuration as slides, in light and dark.
- Links to other posts are relative (`./2026-other-post.md`); OpenKnowledge
  flags broken ones. External links are plain Markdown links.
- Nothing confidential from an employer or client. Back claims with
  something concrete. English, sentence case.

## Publish

1. `draft: false`.
2. `pnpm check` (validates posts and decks) and `pnpm build`; open
   `pnpm preview` and read the post in light and dark, and check its row on
   the homepage.
3. Merge into `main` (from `writing`: a pull request `writing` → `main`, or
   a local merge and push). Only `main` deploys. Afterwards merge `main`
   back into `writing` if code changed.
