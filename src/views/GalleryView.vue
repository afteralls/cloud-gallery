<template>
  <div @click="openGallery" class="_wrapper">
    <div class="collection">
      <TransitionGroup name="image">
        <div v-for="(img, idx) in core.galleryCollection" :key="idx" class="image-wrapper">
          <div class="image-options">
            <div
              class="_delete"
              @click.prevent="server.deleteImage($event)"
              :data-name="img.name"
            ><DeleteIcon /></div>
            <div
              class="_edit"
              @click.prevent="edit($event)"
              :data-name="img.name"
              :data-hashtags="img.hashtags"
            ><EditImageIcon /></div>
          </div>
          <img
            :data-idx="idx"
            :data-name="img.name"
            :data-hashtags="img.hashtags"
            :src="img.src"
            :alt="img.name"
          >
        </div>
      </TransitionGroup>
    </div>
    <TheGalleryViewer
      :is-open="isViewerOpen"
      :current-image="currentImage"
      :cur-idx="curIdx"
      :edit="edit"
      @close-modal="isViewerOpen = false"
      @prev="() => changeCurrentImage(--curIdx)"
      @next="() => changeCurrentImage(++curIdx)"
    />
    <AppModal :is-open="isModalOpen" @close-modal="isModalOpen = false">
      <div class="column">
        <small>Введите теги</small>
        <AppHashInput
          :modal="updateTags"
          @update:hashModel="(value) => updateTags = value"
          @update:addTag="(value) => updateTags += value"
        />
        <div @click="server.updateImageData(curName, updateTags), isModalOpen = false" class="_btn"><small>Обновить</small></div>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DeleteIcon from '@/assets/svg/DeleteIcon.vue'
import AppHashInput from '@/components/AppHashInput.vue'
import EditImageIcon from '@/assets/svg/EditImageIcon.vue'
import AppModal from '@/components/AppModal.vue'
import TheGalleryViewer from '@/components/GalleryView/TheGalleryViewer.vue'
import { useCoreStore } from '@/stores/coreStore'
import { useServerStore } from '@/stores/serverStore'
import type { Image } from '@/stores/coreStore'

const core = useCoreStore()
const server = useServerStore()
const isViewerOpen = ref<boolean>(false)
const isModalOpen = ref<boolean>(false)
const curIdx = ref<number>(0)
const currentImage = ref<Image>()
const curName = ref<string>('')
const updateTags = ref<string>('')

const changeCurrentImage = (idx: number) => currentImage.value = core.galleryCollection[idx]
const openGallery = (evt: any) => {
  if (evt.target.closest(['.image-wrapper']) && !evt.target.closest(['.image-options'])) {
    curIdx.value = +evt.target.dataset.idx
    changeCurrentImage(curIdx.value)
    isViewerOpen.value = true
  }
}

const edit = (evt: any) => {
  const { name, hashtags } = evt.target.dataset
  isModalOpen.value = true
  updateTags.value = hashtags
  curName.value = name
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

.image-wrapper {
  position: relative;
}

.image-options {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  z-index: 5;
  justify-content: center;
  align-items: center;
  gap: calc(var(--space) / 2);
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  padding: calc(var(--space) / 2);
  border-radius: 0 var(--br-rad) 0 var(--br-rad);
  transition: var(--transition);
  opacity: 0;
}

.image-wrapper:hover .image-options {
  opacity: 1;
}

.column {
  display: flex;
  flex-direction: column;
  gap: var(--space);
}
</style>
