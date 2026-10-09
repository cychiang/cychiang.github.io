<script setup lang="ts">
// The deck's cover: the command that opened it, then the title bottom-left,
// the same way the homepage shows a deck in its pane.
import { computed } from 'vue'
import { prompt } from '../../tokens.ts'

const props = defineProps<{ command?: string }>()

const slug = computed(() => {
  const match = import.meta.env.BASE_URL.match(/decks\/([^/]+)\/$/)
  return match?.[1]
})
</script>

<template>
  <div class="slidev-layout cover">
    <p class="cover-prompt" aria-hidden="true">
      <span class="cover-prompt-host">{{ prompt.user }}@{{ prompt.host }}</span><span class="cover-prompt-path">:~</span><span class="cover-prompt-sign">$</span>
      {{ props.command ?? (slug ? `open ${slug}` : 'open deck') }}
    </p>
    <div class="cover-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cover-prompt-host {
  color: var(--color-prompt);
}

.cover-prompt-path {
  color: var(--color-accent);
}

.cover-prompt-sign {
  margin-right: 1ch;
}
</style>
