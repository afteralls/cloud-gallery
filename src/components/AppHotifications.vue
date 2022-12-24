<template>
  <div class="notification">
    <TransitionGroup name="notf">
      <div v-for="item in notifications" :key="item" class="notification__item">
        <small>{{ item }}</small>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotfStore } from '@/stores/notfStore.js'

const { notifications } = useNotfStore()
</script>

<style scoped lang="scss">
.notification {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  margin: var(--space);
  gap: var(--space);

  &__item {
    background-color: var(--tp-c);
    backdrop-filter: blur(8px);
    padding: var(--space);
    border-radius: var(--br-rad);
  }
}

.notf-move,
.notf-enter-active,
.notf-leave-active {
  transition: all 0.5s ease;
}
.notf-enter-from,
.notf-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.notf-leave-active {
  position: absolute;
}
</style>