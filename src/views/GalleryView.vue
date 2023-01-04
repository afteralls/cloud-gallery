<template>
  <div @click="openGallery" class="_wrapper">
    <div class="collection">
      <TransitionGroup name="image">
        <div v-for="(img, idx) in main.galleryCollection" :key="idx" class="image-wrapper">
          <img loading="lazy" :data-idx="idx" :src="img.src" :alt="img.name">
        </div>
      </TransitionGroup>
    </div>
    <TheGalleryViewer
      :is-open="isOpen"
      :current-image="currentImage"
      :cur-idx="curIdx"
      :size="collectionSize"
      @close-modal="isOpen = false"
      @prev="() => changeCurrentImage(--curIdx)"
      @next="() => changeCurrentImage(++curIdx)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TheGalleryViewer from '@/components/GalleryView/TheGalleryViewer.vue'
import { useMainStore } from '@/stores/mainStore'
import type { Image } from '@/stores/mainStore'

const main = useMainStore()
const isOpen = ref<boolean>(false)
const curIdx = ref<number>(0)
const collectionSize = ref<number>(0)
const currentImage = ref<Image>()

const changeCurrentImage = (idx: number) => currentImage.value = main.galleryCollection[idx]
const openGallery = (evt: any) => {
  if (evt.target.closest(['.image-wrapper'])) {
    curIdx.value = +evt.target.dataset.idx
    collectionSize.value = main.galleryCollection.length
    changeCurrentImage(curIdx.value)
    isOpen.value = true
  }
}
</script>

<style scoped lang="scss">
.collection {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space);

  img {
    width: 160px;
    height: 160px;
    border-radius: var(--br-rad);
    cursor: pointer;
    object-fit: cover;
  }
}

.image {
  &-move,
  &-enter-active,
  &-leave-active {
    transition: all 0.5s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: scale(0);
  }

  &-leave-active {
    position: absolute;
  }
}

.column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space);
}

.date {
  padding: var(--space);
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  border-radius: var(--br-rad);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
