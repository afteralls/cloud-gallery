<template>
<div class="_wrapper">
  <div @click="optionsHandler" v-if="core.galleryCollection.length" class="collection">
    <TransitionGroup name="image">
      <div v-for="(img, idx) in core.galleryCollection" :key="idx" class="image-wrapper">
        <div class="image-options">
          <div
            :class="{ '_fav': true, '_fav-active': img.isFavorite }"
            :data-name="img.name"
          ><HeartIcon /></div>
          <div
            class="_delete"
            :data-name="img.name"
          ><DeleteIcon /></div>
          <div
            class="_edit"
            :data-name="img.name"
            :data-hashtags="img.hashtags"
          ><EditImageIcon /></div>
        </div>
        <AppImage :idx="idx" :hashtags="img.hashtags" :name="img.name" :alt="img.name" :src="img.src" />
      </div>
    </TransitionGroup>
  </div>
  <div v-else class="_app-info _column _center">
    <NoImagesIcon />
    <h1>{{ $i18n('gallery.title') }}</h1>
    <h3>{{ $i18n('gallery.desc') }}</h3>
  </div>
  <TheGalleryViewer
    :is-open="isViewerOpen"
    :current-image="currentImage"
    :cur-idx="curIdx"
    :edit-handler="editHandler"
    @close-modal="isViewerOpen = false"
    @prev="() => changeCurrentImage(--curIdx)"
    @next="() => changeCurrentImage(++curIdx)"
  />
  <AppModal :is-open="isModalOpen" @close-modal="isModalOpen = false">
    <div class="_column">
      <small>{{ $i18n('gallery.inputTags') }}</small>
      <AppHashInput
        :model="updateTags"
        @updateModel="(value) => updateTags = value"
        @addTag="(value) => updateTags += value"
      />
      <div @click="server.updateImageData(curName, updateTags), isModalOpen = false" class="_btn">
        <small>{{ $i18n('gallery.update') }}</small>
      </div>
    </div>
  </AppModal>
</div>
</template>

<script setup lang="ts">
const core = useCoreStore()
const server = useServerStore()

const isViewerOpen = ref<boolean>(false)
const isModalOpen = ref<boolean>(false)

const curIdx = ref<number>(0)
const currentImage = ref<Image>()
const curName = ref<string>('')
const updateTags = ref<string>('')

const editHandler = (evt: any) => {
  const { name, hashtags } = evt.target.dataset
  isModalOpen.value = true
  updateTags.value = hashtags
  curName.value = name
}

const changeCurrentImage = (idx: number) => currentImage.value = core.galleryCollection[idx]
const optionsHandler = (evt: MouseEvent) => {
  const target = evt.target as HTMLElement
  
  if (target.dataset.idx) {
    curIdx.value = +target.dataset.idx!
    changeCurrentImage(curIdx.value)
    isViewerOpen.value = true
  }
  else if (target.closest('._delete'))
    server.deleteImage(target.dataset.name!)
  else if (target.closest('._edit'))
    editHandler(evt)
  else if (target.closest('._fav'))
    server.favoriteHandler(target.dataset.name!)
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

  @media(max-width: 900px) {
    img {
      width: 130px;
      height: 130px;
    }
  }

  @media(max-width: 500px) {
    gap: calc(var(--space) / 2);

    img {
      width: 80px;
      height: 80px;
    }
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

  @media(max-width: 900px) {
    display: none;
  }
}

.image-wrapper:hover .image-options {
  opacity: 1;
}
</style>
