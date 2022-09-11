<template>
  <div class="bg"></div>
  <div class="container">
    <router-view v-slot="{ Component }">
      <Transition name="route" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faVolumeXmark, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
library.add(faVolumeXmark, faVolumeHigh)

export default {
  components: { FontAwesomeIcon },
  setup () {
    const currentWidth = ref(0)
    const updateWidth = () => { currentWidth.value = window.innerWidth }
    window.addEventListener('resize', updateWidth)
    onMounted(async () => { updateWidth() })

    return { currentWidth }
  }
}
</script>

<style lang="scss">
@import './assets/scss/main';

.container {
  box-sizing: border-box;
  margin: auto;
}

.bg {
  position: fixed;
  height: 100vh;
  width: 100vw;
  background: url('./assets/img/bg.webp') center no-repeat;
  background-size: cover;
  z-index: -1;
}

.route {
  &-enter-from {
    opacity: 0;
  }
  &-enter-active {
    transition: all 0.2s ease-out;
  }
  &-leave-to {
    opacity: 0;
  }
  &-leave-active {
    transition: all 0.2s ease-in;
  }
}
</style>
