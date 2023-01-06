<template>
  <div class="tip-wrapper">
    <slot name="content" />
    <div :class="{ 'tip': true, position }"><slot name="tip" /></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ position: string }>()
</script>

<style scoped lang="scss">
.tip-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
}

.tip {
  position: absolute;
  border-radius: var(--br-rad);
  padding: var(--space);
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  gap: var(--space);
  justify-content: flex-start;
  z-index: 600;
  opacity: 0;
  visibility: hidden;
  margin: var(--space);
  max-width: 350px;
}

.tip-wrapper:hover .tip {
  opacity: 1;
  visibility: inherit;
}

.top { top: 50px }
.right { right: 50px }
.bottom { bottom: 50px }
.left { left: 50px }
</style>