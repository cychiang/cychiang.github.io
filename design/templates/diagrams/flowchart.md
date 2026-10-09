---
layout: diagram
---

# Flowchart: how a request is handled

```mermaid
flowchart LR
  user([User]):::ext --> api[API gateway]:::focus
  api --> auth{Authenticated?}
  auth -- no --> reject[401 reply]:::fail
  auth -- yes --> svc[Order service]
  svc --> db[(Orders DB)]:::store
  svc -.-> queue[[Event queue]]:::store
  queue -.-> mail[Mail worker]:::ok
```

<!--
Template: flowchart. Copy the mermaid block into a slide with `layout: diagram`.

- Direction: LR on slides (16:9). Use TB only for short, deep chains.
- Shapes carry structure: [process], {decision}, ([start or end]),
  [(database)], [[queue or buffer]]. Do not invent others.
- Edges: solid for the normal path, dotted (-.->) for asynchronous or
  eventual, thick (==>) for the one path the slide is about.
- Labels on edges answer a question (yes / no / on failure), two words at most.
- Classes carry meaning, nothing else: :::focus for the subject, :::ok healthy,
  :::warn degraded or pending, :::fail failure or forbidden, :::ext outside
  the system, :::store data at rest. Everything else stays plain.
- Keep it to about 8 nodes. More than that is two slides.
-->
