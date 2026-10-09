---
layout: diagram
---

# Sequence: creating a resource through the control plane

```mermaid
sequenceDiagram
  autonumber
  participant Dev as Platform team
  participant API as API server
  participant Ctrl as Controller
  participant Cloud as Cloud API

  Dev->>API: apply Database manifest
  API-->>Dev: accepted (status: pending)
  loop every reconcile
    Ctrl->>API: watch Database objects
    API-->>Ctrl: Database (desired state)
    Ctrl->>Cloud: create or update instance
    Cloud-->>Ctrl: current state
    Ctrl->>API: update status
  end
  Note over Ctrl,Cloud: drift is corrected here
```

<!--
Template: sequence. Copy the mermaid block into a slide with `layout: diagram`.

- Participants left to right in the order a request travels. Short aliases
  (Dev, API, Ctrl) keep the lifelines close together.
- Solid arrows are requests, dashed arrows are replies (the dashed form
  cannot be written inside this note; see the diagram above).
- `loop`, `alt` and `opt` blocks show control flow; use at most one per slide.
- One note per slide, for the single point the picture exists to make.
- `autonumber` when the talk refers to steps by number; leave it out otherwise.
- Eight messages is a comfortable maximum.
-->
