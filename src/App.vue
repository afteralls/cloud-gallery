<template>
<TheNavbar />
<AppHotifications />
<AppBackground class="app-background _full-fixed" />
<div class="app-wrapper _full-fixed"></div>
<div class="_container">
  <RouterView v-slot="{ Component }">
    <Transition name="main" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</div>
</template>

<script setup lang="ts">
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
