<template>
<<<<<<< HEAD
<TheNavbar />
<AppHotifications />
<AppBackground class="app-background _full-fixed" />
<div class="app-wrapper _full-fixed"></div>
<div class="_container">
  <RouterView v-slot="{ Component }">
    <Transition name="main" mode="out-in">
      <component v-if="isOnline" :is="Component" />
      <div v-else class="_wrapper">
        <div class="_app-info _column _center">
          <NoConnectionIcon />
          <h1>{{ $i18n('app.offlineTitle') }}</h1>
          <h3>{{ $i18n('app.offlineDesc') }}</h3>
        </div>
      </div>
    </Transition>
  </RouterView>
</div>
</template>

<script setup lang="ts">
const isOnline = useOnline()
const router = useRouter()
const server = useServerStore()
const i18n = inject('func') as LangFunc

router.beforeEach((to, _, next) => {
  server.getDataHandler()
  const go = () => { document.title = i18n(to.name as string); next() }
  to.path === '/upload'
    ? localStorage.getItem('auth-token') ? go() : next({ path: '/' })
    : go()
})
</script>

<style scoped lang="scss">
.app-wrapper {
  backdrop-filter: blur(40px);
  background-color: var(--tp-c);
  z-index: -1;
}

.app-background { z-index: -2; }
=======
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
>>>>>>> b91aaa256301ce0539285245553802220f174f4a
</style>
