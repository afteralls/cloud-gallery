<template>
  <div v-if="isLoading" class="load _tp-wp _center"><LoadingIcon /></div>
  <img v-else :data-idx="idx" :data-name="name" :data-hashtags="hashtags" :src="src" :alt="name">
</template>

<script setup lang="ts">
const props = defineProps<{
  idx: number
  name: string
  hashtags: string
  src: string
  alt: string
}>()

const { isLoading } = useImage({ src: props.src })
</script>

<style lang="scss">
.load {
  width: 160px;
  height: 160px;

  svg {
    height: 100px;
    width: auto;
  }

  @media(max-width: 900px) {
    width: 130px;
    height: 130px;

    svg {
      height: 80px;
      width: auto;
    }
  }

  @media(max-width: 500px) {
    width: 80px;
    height: 80px;

    svg {
      height: 50px;
      width: auto;
    }
  }
}
</style>

