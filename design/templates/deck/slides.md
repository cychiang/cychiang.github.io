---
theme: terminal
title: Design specimen
info: |
  Every layout, component and diagram template of the terminal design system
  on one deck. Not published; preview with `pnpm design:preview`.
routerMode: hash
themeConfig:
  prompt: { user: cychiang, host: specimen }
card:
  date: 2026-10-09
  type: note
  draft: true
---

# Design specimen

Every layout and component, as a reference

---
layout: cover
prompt: { user: speaker, host: kubecon, path: ~/talks, command: ./start --live }
---

# A cover with its own prompt

Set per slide, or for the whole deck in the headmatter

---

# A default slide

Body text is JetBrains Mono at a size that fits about seventy characters on a
line. **Strong** is the only emphasis; *italic* is for titles of things.

- Lists are plain text with a dash
- Nested points indent by two characters
  - like this
- Links look like this: [sli.dev](https://sli.dev)

1. Ordered lists count
2. the same way

> A quoted line reads as a reply, soft and indented.

---

# Code is a pane

```ts {2|3-4|all}
const desired = await load('database.yaml')
const current = await cloud.describe(desired.name)
if (!deepEqual(desired.spec, current)) {
  await cloud.update(desired)
}
```

Inline `code` sits in a small pane of its own.

---

# Commands and panes

<Prompt>kubectl get managed</Prompt>

<Prompt user="root" host="node-1" path="/var/log">tail -n 3 syslog</Prompt>

<Pane title="output" status="3 objects">

```text
NAME               READY   SYNCED   AGE
orders-db          True    True     4d
orders-bucket      True    True     4d
orders-queue       False   True     12m
```

</Pane>

Status words use the only colours there are: <span class="ok">ready</span>,
<span class="warn">pending</span>, <span class="fail">failed</span>,
<span class="soft">soft</span>.

---
layout: two-cols
---

# Two columns

Left: the claim.

- Reconcile loops make drift a non-event
- The cost is a controller to run

::right::

Right: the evidence.

| Metric | Before | After |
| --- | --- | --- |
| Drift incidents | 11 | 0 |
| Time to provision | 2 days | 14 min |

---
layout: section
---

# A section heading

Chapter two of the deck

---
layout: statement
---

# One sentence the audience should remember.

---
layout: fact
---

# 14 min

from pull request to a database that exists

---
layout: quote
---

# "If it's not in the API server, it doesn't exist."

Someone on the platform team

---
layout: center
---

# Centred

For the slide that is one short thing.

---
src: ../diagrams/flowchart.md
---

---
src: ../diagrams/architecture.md
---

---
src: ../diagrams/sequence.md
---

---
src: ../diagrams/state.md
---

---
layout: end
---

# exit

Thanks. Questions?
