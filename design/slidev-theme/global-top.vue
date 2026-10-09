<script setup lang="ts">
// The status line at the bottom of every slide, as in a terminal multiplexer:
// the deck on the left, the position on the right. A global-top layer, because
// slides paint their own background over anything below them.
import { useNav, useSlideContext } from '@slidev/client'

const { currentPage, total, currentLayout, isPresenter } = useNav()
const { $slidev } = useSlideContext()
</script>

<template>
  <div v-if="currentLayout !== 'cover' && !isPresenter" class="status-line" aria-hidden="true">
    <span class="status-title">{{ $slidev.configs.title }}</span>
    <span class="status-page">{{ currentPage }}/{{ total }}</span>
  </div>
</template>
