<template>
  <div class="preview">
    <transition name="main" mode="out-in">
      <div class="preview-wrapper" v-if="previewImages.length">
        <div class="preview-row">
          <TransitionGroup name="images">
            <div class="image-wrapper" v-for="(item, idx) in previewImages" :key="idx">
              <div class="remove" :data-idx="idx"><CloseIcon /></div>
              <img :src="item.src" :alt="item.name" :title="item.name">
              <div class="info"><small>{{ item.size }}</small></div>
            </div>
          </TransitionGroup>
          <div>&nbsp;</div>
        </div>
      </div>
      <div v-else class="preview-tip">
        <InfoIcon />
        <h3>Здесь будут ваши изображения, как только вы добавите их</h3>
        <p>Попробуйте добавить несколько изображений для их дальнейшего редактирования и отбора</p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import InfoIcon from '@/assets/svg/InfoIcon.vue'
import CloseIcon from '@/assets/svg/CloseIcon.vue'

interface PreviewInfo { name?: string, src?: string, size?: string }
defineProps<{ previewImages: PreviewInfo[]}>()
</script>

<style scoped lang="scss">
.preview {
  padding: var(--space) 0px var(--space) var(--space);
  border-radius: var(--br-rad);
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  img {
    height: 268px;
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
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: var(--transition);
  backdrop-filter: blur(8px);
  border-radius: 0 0 var(--space) var(--space);
  opacity: 0;
}

.image-wrapper:hover .info,
.image-wrapper:hover .remove {
  opacity: 1;
}

.remove {
  position: absolute;
  top: 0; right: 0;
  border-radius: 0 var(--space) 0 var(--space);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 5px;
  backdrop-filter: blur(10px);
  font-size: 30px;
  cursor: pointer;
  color: white;
  text-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity var(--transition);
}

.progress {
  position: absolute;
  bottom: 0;
  left: 0;
  top: 0;
  width: 100%;
  background-color: var(--accent-c);
  transition: width var(--transition);
  z-index: 1;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
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