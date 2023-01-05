<template>
  <Teleport to="body">
    <Transition name="main">
      <div v-if="isOpen" class="modal">
        <div class="modal__window">
          <div @click="$emit('closeModal')" class="modal__close"><CloseIcon /></div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import CloseIcon from '@/assets/svg/CloseIcon.vue'

defineProps(['isOpen'])
defineEmits(['closeModal'])
</script>

<style scoped lang="scss">
.modal {
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;

  &__window {
    gap: var(--space);
    background-color: var(--bg-c);
    backdrop-filter: blur(8px);
    padding: var(--space);
    border-radius: var(--br-rad);
    position: relative;
    max-width: 332px;
  }

  &__close {
    position: absolute;
    top: -32px;
    right: 0;
    cursor: pointer;
  }
}
</style>
