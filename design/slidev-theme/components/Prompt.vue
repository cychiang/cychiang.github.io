<script setup lang="ts">
// A shell prompt followed by a command, for showing what was typed:
//   <Prompt>kubectl get pods</Prompt>
import { prompt } from '../../tokens.ts'
</script>

<template>
  <span class="prompt">
    <span class="prompt-host">{{ prompt.user }}@{{ prompt.host }}</span><span class="prompt-path">:~</span><span class="prompt-sign">$</span>
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
