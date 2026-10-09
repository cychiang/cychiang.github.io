# slidev-theme-terminal

The Slidev theme for every deck in this repository. It is part of the design
system in `design/`; the rules and the rationale are in `design/README.md`.

Every deck uses it:

```yaml
---
theme: terminal
---
```

Layouts: `cover`, `default`, `section`, `diagram`, `end`, plus Slidev's
built-in `center`, `two-cols`, `two-cols-header`, `statement`, `fact`,
`quote`, `image-*` and `iframe-*`, restyled.

Components: `<Prompt>command</Prompt>`, `<Pane title="…">…</Pane>`.

Colour classes (the only ones): `.ok`, `.warn`, `.fail`, `.soft`.

Preview everything with `pnpm design:preview`.
