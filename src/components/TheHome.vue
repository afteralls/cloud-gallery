<template>
  <div class="main">
    <video v-if="currentWidth > 720" src="../assets/video/euth.mp4" autoplay muted loop></video>
    <video v-else src="../assets/video/euth-mob.mp4" autoplay muted loop></video>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup () {
    const currentWidth = ref(0)
    const updateWidth = () => { currentWidth.value = window.innerWidth }
    window.addEventListener('resize', updateWidth)
    onMounted(() => { updateWidth() })

    return { currentWidth }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/main';

.main {
  @include all-cent;
  height: 100vh;
  width: 100vw;
}
</style>
