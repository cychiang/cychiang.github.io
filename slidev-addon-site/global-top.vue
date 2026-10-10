<script setup lang="ts">
// A link back to the homepage, top-right on every slide of every deck (the
// theme's cover uses the top-left for its prompt line). Without it the
// only way out of a deck is the browser's back button, once per slide viewed.
// Hidden where it would get in the way: presenter view, exports, embeds.
//
// Both elements here are interface, not slide content, so they undo the
// slide's scale and stay the same size on a phone and a projector.
import { useNav } from '@slidev/client'
import { siteHome, siteHomeLabel } from './site-home'

const { isPrintMode, isPresenter, isEmbedded } = useNav()
</script>

<template>
  <template v-if="!isPrintMode && !isPresenter && !isEmbedded">
    <a
      v-if="siteHome"
      class="site-home"
      :href="siteHome"
      title="Back to all decks"
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path d="M9.5 3.5 5 8l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span>{{ siteHomeLabel }}</span>
    </a>
    <!-- Slides are a fixed canvas; held upright, a phone shows them at
         less than half size. The space above the slide says so. It is
         teleported out because the slide container clips at its edges. -->
    <Teleport to="body">
      <p class="portrait-hint" aria-hidden="true"># rotate your phone for a larger slide</p>
    </Teleport>
  </template>
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
  transform: scale(calc(1 / var(--slidev-slide-scale, 1)));
  transform-origin: top right;
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

.portrait-hint {
  display: none;
  position: fixed;
  top: 12px;
  left: 16px;
  z-index: 20;
  margin: 0;
  color: var(--color-ink-soft, #8b94a3);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.78rem;
  line-height: 1.4;
  white-space: nowrap;
}

@media (orientation: portrait) and (max-width: 48rem) {
  .portrait-hint {
    display: block;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-home {
    transition: none;
  }
}
</style>
