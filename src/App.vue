<template>
  <div class="bg"></div>
  <audio autoplay loop preload="auto">
    <source src="./assets/music/music-collection.mp3" type="audio/mpeg"/>
  </audio>
  <div v-if="currentWidth > 1000" class="sound">
    <button class="_btn" @click="soundHandler">
      <font-awesome-icon v-if="sound" icon="fa-solid fa-volume-xmark" size="lg" />
      <font-awesome-icon v-else icon="fa-solid fa-volume-high" size="lg" />
    </button>
  </div>
  <div class="container">
    <router-view v-slot="{ Component }">
      <Transition name="route" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

<script>
import { onMounted, ref, onBeforeMount } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faVolumeXmark, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
library.add(faVolumeXmark, faVolumeHigh)

export default {
  components: { FontAwesomeIcon },
  setup () {
    const sound = ref(false)
    let soundSelector

    onBeforeMount(() => {
      sound.value = JSON.parse(localStorage.getItem('soundMute')) || false
    })

    const soundHandler = () => {
      soundSelector.muted = !soundSelector.muted
      sound.value = soundSelector.muted
      localStorage.setItem('soundMute', soundSelector.muted)
    }

    const currentWidth = ref(0)
    const updateWidth = () => { currentWidth.value = window.innerWidth }
    window.addEventListener('resize', updateWidth)
    onMounted(async () => {
      updateWidth()
      soundSelector = document.querySelector('audio')
      soundSelector.muted = sound.value
      if (currentWidth.value < 1000) {
        soundSelector.muted = true
      }
    })

    return { soundHandler, sound, currentWidth }
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
  background: url('./assets/img/main-background.webp') center no-repeat;
  background-size: cover;
  z-index: -1;
}

.sound {
  @include all-cent;
  @include glass-effect;
  flex-direction: column;
  gap: $space / 2;
  position: fixed;
  bottom: $space;
  right: $space;
  padding: $space / 2;
  z-index: 5;

  & ._btn {
    padding: $space / 2;
    height: 40px;
    width: 40px;
  }

  @media (max-width: $extra-medium) {
    bottom: 95px;
  }
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
