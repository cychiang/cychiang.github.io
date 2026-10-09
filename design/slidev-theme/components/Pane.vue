<script setup lang="ts">
// A terminal pane: a title bar with a path or name, then whatever goes inside.
//   <Pane title="decks/2026-hello-world">…</Pane>
defineProps<{ title?: string; status?: string }>()
</script>

<template>
  <div class="pane">
    <div v-if="title || status" class="pane-bar">
      <span class="pane-title">{{ title }}</span>
      <span v-if="status" class="pane-status">{{ status }}</span>
    </div>
    <div class="pane-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.pane {
  display: flex;
  flex-direction: column;
  margin: 1em 0;
  border: var(--border) solid var(--color-line);
  border-radius: var(--radius);
  background: var(--color-surface);
  overflow: hidden;
}

.pane-bar {
  display: flex;
  justify-content: space-between;
  gap: 2ch;
  padding: 0.3em 1.2ch;
  border-bottom: var(--border) solid var(--color-line);
  color: var(--color-ink-soft);
  font-size: 0.78em;
  white-space: nowrap;
}

.pane-title {
  overflow: hidden;
  text-overflow: ellipsis;
}

.pane-body {
  padding: 0.6em 1.2ch;
}

.pane-body :deep(> :first-child) {
  margin-top: 0;
}

.pane-body :deep(> :last-child) {
  margin-bottom: 0;
}

.pane-body :deep(.slidev-code-wrapper) {
  border: 0;
  margin: 0;
}
</style>
