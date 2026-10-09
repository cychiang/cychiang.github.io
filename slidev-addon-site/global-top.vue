<script setup lang="ts">
// A link back to the homepage, top-right on every slide of every deck (the
// theme's cover uses the top-left for its prompt line). Without it the
// only way out of a deck is the browser's back button, once per slide viewed.
// Hidden where it would get in the way: presenter view, exports, embeds.
import { useNav } from '@slidev/client'
import { siteHome, siteHomeLabel } from './site-home'

const { isPrintMode, isPresenter, isEmbedded } = useNav()
</script>

<template>
  <a
    v-if="siteHome && !isPrintMode && !isPresenter && !isEmbedded"
    class="site-home"
    :href="siteHome"
    title="Back to all decks"
  >
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M9.5 3.5 5 8l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <span>{{ siteHomeLabel }}</span>
  </a>
</template>

<style scoped>
/* Inherits the slide's text colour, so it works on any Slidev theme. */
.site-home {
  position: absolute;
  top: 10px;
  right: 12px;
  z-index: 20;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px 4px 6px;
  border-radius: var(--radius, 4px);
  color: inherit;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.78rem;
  line-height: 1.4;
  text-decoration: none;
  opacity: 0.55;
  transition: opacity 120ms ease, background-color 120ms ease;
}

.site-home:hover,
.site-home:focus-visible {
  opacity: 1;
  background: color-mix(in srgb, currentColor 12%, transparent);
}

.site-home:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .site-home {
    transition: none;
  }
}
</style>
