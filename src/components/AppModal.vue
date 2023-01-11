<template>
<Teleport to="body">
  <Transition name="main" mode="out-in">
    <div v-if="isOpen" @click="closeHandler" class="_center modal _full-fixed">
      <div class="modal-window _bg-wp">
        <slot />
      </div>
    </div>
  </Transition>
</Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

const closeHandler = (evt: MouseEvent) => {
  if(!(evt.target as HTMLElement).closest('.modal-window'))
    emit('closeModal')
}
</script>

<style scoped lang="scss">
.modal {
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  z-index: 9;
}

.modal-window {
  position: relative;
  max-width: 332px;
  margin: var(--space);
}
</style>
