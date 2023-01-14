<template>
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
</style>
