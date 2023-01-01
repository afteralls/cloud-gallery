<template>
  <Teleport to="body">
    <Transition name="main">
      <div @click="showInterface" v-if="isOpen" class="modal">
        <div
          @click="$emit('prev')"
          :class="{ arrow: true, 'arrow-left': true, '_disabled': curIdx === 0, 'active': isShow }"
        ><ArrowLeftIcon /></div>
        <div
          @click="$emit('next')"
          :class="{ arrow: true, 'arrow-right': true, _disabled: curIdx === size - 1, 'active': isShow }"
        ><ArrowRightIcon /></div>
        <div :class="{ 'interface': true, 'viewer-header': true, 'active': isShow }">
          <small>{{ curIdx + 1 }} / {{ size }}</small>
          <CloseIcon @click="$emit('closeModal')" />
        </div>
        <img @dblclick="zoom" ref="curImage" :src="currentImage?.src" :alt="currentImage?.name">
        <div :class="{ 'interface': true, 'viewer-footer': true, 'active': isShow }">
          <small>Загрузил: {{ currentImage?.uploader }}</small>
          <small>Хэштеги: {{ currentImage?.hashtags }}</small>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEventListener, useSwipe } from '@vueuse/core'
import CloseIcon from '@/assets/svg/CloseIcon.vue'
import ArrowLeftIcon from '@/assets/svg/ArrowLeftIcon.vue'
import ArrowRightIcon from '@/assets/svg/ArrowRightIcon.vue'
import type { Image } from '@/stores/mainStore'

const props = defineProps<{ isOpen: boolean, currentImage?: Image, curIdx: number, size: number }>()
const emit = defineEmits<{ (e: 'closeModal'): void, (e: 'prev'): void, (e: 'next'): void }>()

const isShow = ref<boolean>(true)
const showInterface = (evt: any) => {
  if (!evt.target.closest(['.interface', '.arrow'])) {
    isShow.value = !isShow.value
  }
}

const zoom = () => {
  console.log('sdfdsf')
}

const curImage = ref(null)
const imageArea = ref()

useEventListener(document, 'keyup', (evt: any) => {
  if (evt.code === 'ArrowLeft' && props.curIdx !== 0)
    emit('prev')
  if (evt.code === 'ArrowRight' && props.curIdx !== props.size - 1)
    emit('next')
})
</script>

<style scoped lang="scss">
.modal {
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: auto;
    width: auto;
    max-width: 100%;
    max-height: 100%;
    transition: var(--transition);
  }
}

.interface, .arrow {
  position: fixed;
  display: flex;
  align-items: center;
  z-index: 11;
  height: 50px;
  transition: var(--transition);
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  opacity: 0;
}

.interface {
  justify-content: space-between;
  padding: 0 var(--space);
  gap: var(--space);
  width: 100%;
}

.viewer-header {
  top: 0;
}

.viewer-footer {
  bottom: 0;
}

.active {
  opacity: 1;
}

.arrow {
  position: fixed;
  justify-content: center;
  width: 50px;
  border-radius: var(--br-rad);
  svg { pointer-events: none; }
}

.arrow-left {
  left: 16px;
}

.arrow-right {
  right: 16px;
}
</style>
