<script setup lang="ts">
// A shell prompt followed by a command, for showing what was typed:
//   <Prompt>kubectl get pods</Prompt>
//   <Prompt user="root" host="node-1" path="/var/log">tail -f syslog</Prompt>
// Parts left out come from the deck's headmatter (themeConfig.prompt), then
// from design/tokens.ts.
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import { deckPrompt, resolvePrompt } from '../prompt.ts'

const props = defineProps<{ user?: string; host?: string; path?: string }>()
const { $slidev } = useSlideContext()
const line = computed(() => resolvePrompt({ user: props.user, host: props.host, path: props.path }, deckPrompt($slidev.configs))!)
</script>

<template>
  <span class="prompt">
    <span class="prompt-host">{{ line.user }}@{{ line.host }}</span><span class="prompt-path">:{{ line.path }}</span><span class="prompt-sign">$</span>
    <span class="prompt-command"><slot /></span>
  </span>
</template>

<style scoped>
.prompt {
  display: inline-block;
}

.prompt-host {
  color: var(--color-prompt);
}

.prompt-path {
  color: var(--color-accent);
}

.prompt-sign {
  color: var(--color-ink-soft);
}

.prompt-command {
  margin-left: 1ch;
}
</style>
