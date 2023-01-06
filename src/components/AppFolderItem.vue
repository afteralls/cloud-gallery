<template>
<div class="_btn folder">
  <GlobalIcon v-if="type === 'global'" />
  <LocalIcon v-else />
  <small>{{ name }}</small>
</div>
</template>

<script setup lang="ts">
import GlobalIcon from '@/assets/svg/GlobalIcon.vue'
import LocalIcon from '@/assets/svg/LocalIcon.vue'

defineProps<{ type: string, name: string }>()
</script>

<style scoped lang="scss">
.folder {
  display: flex;
  align-items: center;
  padding: calc(var(--space) / 2) var(--space);
  gap: calc(var(--space) / 2);

  svg {
    fill: var(--dark-txt-c);
    width: auto;
  }

  small, svg { pointer-events: none; }
}
</style>