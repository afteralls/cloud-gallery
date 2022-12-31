<template>
  <div class="_wrapper">
    <div class="gallery">
      <TransitionGroup name="image">
        <div v-for="(img, idx) in main.galleryCollection" :key="idx" class="image-wrapper">
          <img :src="img.src" :alt="img.name">
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMainStore } from '@/stores/mainStore'

const main = useMainStore()

</script>

<style scoped lang="scss">
.gallery {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space);

  img {
    width: 150px;
    height: 150px;
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
</style>