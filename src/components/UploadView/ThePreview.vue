<template>
<section class="preview _center _tp-wp">
  <transition name="main" mode="out-in">
    <div class="preview-wrapper" v-if="core.previewImages.length">
      <div @click="deleteImage" class="preview-row">
        <TransitionGroup name="images">
          <div class="image-wrapper _center" v-for="(item, idx) in core.previewImages" :key="idx">
            <div class="remove _center" :data-idx="idx"><CloseIcon /></div>
            <img :src="item.src" :alt="item.name" :title="item.name">
            <div :class="{ 'info': true, '_center': true, 'uploading': server.isUploading }">
              <div v-show="server.isUploading" class="progress _center _absolute"></div>
              <small v-if="!server.isUploading">{{ item.size }}</small>
            </div>
          </div>
        </TransitionGroup>
        <div>&nbsp;</div>
      </div>
    </div>
    <div v-else class="preview-tip _center">
      <InfoIcon />
      <h3>{{ $i18n('upload.previewTitle') }}</h3>
      <p>{{ $i18n('upload.previewDesc') }}</p>
      <h5>{{ $i18n('upload.previewTip') }}</h5>
    </div>
  </transition>
</section>
</template>

<script setup lang="ts">
const core = useCoreStore()
const server = useServerStore()

const deleteImage = (evt: MouseEvent) => {
  const target = evt.target as HTMLElement

  if (target.closest('.remove')) {
    const idx: number = +target.dataset.idx!
    core.previewImages.splice(idx, 1)
    core.clientImages?.splice(idx, 1)
  }
}
</script>

<style scoped lang="scss">
.preview {
  height: 282px;
  width: 100%;
  max-width: 100%;
  overflow-x: scroll;

  small {
    color: var(--dark-txt-c);
  }
}

.preview-wrapper {
  display: inline-block;
  max-width: 100%;
}

.preview-row {
  display: flex;
  gap: var(--space);
}

.preview-tip {
  padding-right: var(--space);
  flex-direction: column;
  max-width: 500px;
  text-align: center;
  gap: var(--space);

  svg {
    height: 50px;
    width: auto;
  }
}

.image-wrapper {
  position: relative;

  img {
    height: 250px;
    width: auto;
    border-radius: var(--br-rad);
  }

  svg {
    fill: var(--dark-txt-c);
    pointer-events: none;
  }
}

.info {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 32px;
  color: white;
  transition: var(--transition);
  backdrop-filter: blur(8px);
  background-color: var(--tp-c);
  border-radius: 0 0 var(--space) var(--space);
  opacity: 0;
  overflow: hidden;
}

.progress {
  height: 32px;
  width: 0%;
  color: var(--dark-txt-c);
  background-color: var(--accent-c);
  transition: width var(--transition);
  text-align: center;
}

.uploading,
.image-wrapper:hover .info,
.image-wrapper:hover .remove {
  opacity: 1;
}

.remove {
  position: absolute;
  top: 0; right: 0;
  border-radius: 0 var(--space) 0 var(--space);
  width: 50px;
  height: 32px;
  backdrop-filter: blur(8px);
  background-color: var(--tp-c);
  font-size: 30px;
  cursor: pointer;
  color: white;
  text-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity var(--transition);
}

.progress {
  width: 0%;
  background-color: var(--accent-c);
  transition: var(--transition);
  z-index: 1;
  text-align: center;
}

.images {
  &-move,
  &-enter-active,
  &-leave-active {
    transition: all 0.3s ease-out;
  }
  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
  &-leave-active {
    position: absolute;
  }
}
</style>