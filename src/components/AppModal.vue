<template>
<Teleport to="body">
  <Transition name="main" mode="out-in">
    <div v-if="isOpen" class="_center modal">
      <div class="modal-window _bg-wp">
        <div @click="$emit('closeModal')" class="modal-close"><CloseIcon /></div>
        <slot />
      </div>
    </div>
  </Transition>
</Teleport>
</template>

<script setup lang="ts">
import CloseIcon from '@/assets/svg/CloseIcon.vue'

defineProps<{ isOpen: boolean }>()
defineEmits<{ (e: 'closeModal'): void }>()
</script>

<style scoped lang="scss">
.modal {
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 50;
}

.modal-window {
  position: relative;
  max-width: 332px;
}

.modal-close {
  position: absolute;
  top: -32px;
  right: 0;
  cursor: pointer;
}
</style>
