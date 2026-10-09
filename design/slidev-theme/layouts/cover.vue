<script setup lang="ts">
// The deck's cover: the command that opened it, then the title bottom-left,
// the same way the homepage shows a deck in its pane.
//
// The prompt line can be changed from the Markdown. In the cover slide's
// frontmatter:
//   prompt: { user: speaker, host: kubecon, path: ~/talks, command: ./start }
//   prompt: "./start"        # command only
//   prompt: false            # no prompt line
// For the whole deck, in the headmatter:
//   themeConfig: { prompt: { user: speaker, host: kubecon } }
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import type { PropType } from 'vue'
import { deckPrompt, resolvePrompt } from '../prompt.ts'
import type { PromptOverride } from '../prompt.ts'

// `type: null` accepts any value. A Boolean prop type would make Vue turn an
// absent `prompt` into `false`, which would hide the line on every cover.
const props = defineProps({
  prompt: { type: null as unknown as PropType<PromptOverride>, default: undefined },
})
const { $slidev } = useSlideContext()

const slug = computed(() => import.meta.env.BASE_URL.match(/decks\/([^/]+)\/$/)?.[1])

const line = computed(() => {
  const resolved = resolvePrompt(props.prompt, deckPrompt($slidev.configs))
  if (!resolved) return null
  return { ...resolved, command: resolved.command ?? (slug.value ? `open ${slug.value}` : 'open deck') }
})
</script>

<template>
  <div class="slidev-layout cover">
    <p v-if="line" class="cover-prompt" aria-hidden="true">
      <span class="cover-prompt-host">{{ line.user }}@{{ line.host }}</span><span class="cover-prompt-path">:{{ line.path }}</span><span class="cover-prompt-sign">$</span>
      {{ line.command }}
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
  color: var(--color-ink-soft);
}
</style>
