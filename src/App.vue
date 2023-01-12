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
console.log(isOnline.value)

watch(isOnline, () => console.log(isOnline.value))
const { getDataHandler } = useServerStore()
onMounted(() => { getDataHandler() })
</script>

<style scoped lang="scss">
.app-wrapper {
  backdrop-filter: blur(40px);
  background-color: var(--tp-c);
  z-index: -1;
}

.app-background {
  z-index: -2;
}
</style>
