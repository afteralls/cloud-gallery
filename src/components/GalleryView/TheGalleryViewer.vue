<template>
<Teleport to="body">
  <Transition name="main">
    <div ref="viewer" v-if="isOpen && size" class="modal _center">
      <div
        @click="$emit('prev')"
        :class="{ 'arrow': true, 'arrow-left': true, '_disabled': curIdx === 0, 'active': isShow }"
      ><ArrowLeftIcon /></div>
      <div
        @click="$emit('next')"
        :class="{
          'arrow': true,
          'arrow-right': true,
          '_disabled': curIdx === size - 1,
          'active': isShow
        }"
      ><ArrowRightIcon /></div>
      <div :class="{ 'interface': true, 'viewer-header': true, 'active': isShow }">
        <small>{{ curIdx + 1 }} / {{ size }}</small>
        <div class="options _center">
          <div
            class="_delete"
            @click.prevent="deleteHandler"
            :data-name="currentImage?.name"
          ><DeleteIcon /></div>
          <div
            class="_edit"
            @click.prevent="edit($event)"
            :data-name="currentImage?.name"
            :data-hashtags="currentImage?.hashtags"
          ><EditImageIcon /></div>
          <Transition name="main" mode="out-in">
            <FullscreenEnterIcon v-if="!isFullscreen" @click="enter" />
            <FullscreenExitIcon v-else @click="exit" />
          </Transition>
          <CloseIcon @click="$emit('closeModal')" />
        </div>
      </div>
      <div class="active-image">
        <img ref="curImage" :src="currentImage?.src" :alt="currentImage?.name">
      </div>
      <div :class="{ 'interface': true, 'viewer-footer': true, 'active': isShow }">
        <h5>Хэштеги: </h5><div class="_btn _hash"><h5>{{ currentImage?.hashtags }}</h5></div>
      </div>
    </div>
  </Transition>
</Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DeleteIcon from '@/assets/svg/DeleteIcon.vue'
import EditImageIcon from '@/assets/svg/EditImageIcon.vue'
import { useEventListener, useFullscreen } from '@vueuse/core'
import FullscreenEnterIcon from '@/assets/svg/FullsceenEnterIcon.vue'
import FullscreenExitIcon from '@/assets/svg/FullscreenExitIcon.vue'
import CloseIcon from '@/assets/svg/CloseIcon.vue'
import ArrowLeftIcon from '@/assets/svg/ArrowLeftIcon.vue'
import ArrowRightIcon from '@/assets/svg/ArrowRightIcon.vue'
import { useServerStore } from '@/stores/serverStore'
import { useCoreStore } from '@/stores/coreStore'
import type { Image } from '@/types'

const props = defineProps<{
  isOpen: boolean
  currentImage?: Image
  curIdx: number
  edit: Function
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void, (e: 'prev'): void
  (e: 'next'): void
}>()

const server = useServerStore()
const core = useCoreStore()

const size = computed(() => core.galleryCollection.length)
const isShow = ref<boolean>(true)
const viewer = ref<HTMLDivElement | null>(null)
const { isFullscreen, enter, exit } = useFullscreen(viewer)
const interval = ref<NodeJS.Timeout>()

useEventListener(viewer, 'mousemove', () => {  
  clearTimeout(interval.value)
  isShow.value = true
  interval.value = setTimeout(() => { isShow.value = false }, 3000)
})

useEventListener(document, 'keyup', (evt: any) => {  
  console.log(evt.code)
  if (evt.code === 'ArrowLeft' && props.curIdx !== 0) emit('prev')
  if (evt.code === 'ArrowRight' && props.curIdx !== size.value - 1) emit('next')
  if (evt.code === 'Escape') emit('closeModal')
})

useEventListener(viewer, 'wheel', (evt: any) => {
  evt.preventDefault()  
  if (evt.deltaY < 0 && props.curIdx !== 0) emit('prev')
  if (evt.deltaY > 0 && props.curIdx !== size.value - 1) emit('next')
})

const changeActiveImage = () => {
  if (size.value >= 1) {
    switch (props.curIdx) {
      case 0: emit('next'); emit('prev'); break
      case size.value - 1: emit('prev'); break
      default: emit('next'); break
    }
  } else { emit('closeModal') }
}

const deleteHandler = async (evt: any) => {
  await server.deleteImage(evt)
  changeActiveImage()
}
</script>

<style scoped lang="scss">
.modal {
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8;
}

.active-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: auto;

  img {
    height: auto;
    width: auto;
    max-width: 100%;
    max-height: 100%;
  }
}

.interface, .arrow {
  position: fixed;
  display: flex;
  align-items: center;
  z-index: 8;
  opacity: 0;
  transition: var(--transition);
}

.interface {
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  height: 50px;
  padding: 0 var(--space);
  width: 100%;
}

.viewer-header {
  justify-content: space-between;
  gap: var(--space);
  top: 0;
}

.options {
  gap: var(--space);
}

.viewer-footer {
  justify-content: center;
  gap: 5px;
  bottom: 0;
}

.active {
  opacity: 1;
}

.arrow {
  position: fixed;
  justify-content: center;
  border-radius: var(--br-rad);
  height: 80%;
  cursor: pointer;

  &:hover {
    background-color: var(--tp-c);
  }

  svg {
    pointer-events: none;
    height: 100px;
    width: auto;
  }

  @media(max-width: 900px) {
    width: 30%;
    opacity: 0;
  }
}

.arrow-left {
  left: var(--space);
}

.arrow-right {
  right: var(--space);
}
</style>
