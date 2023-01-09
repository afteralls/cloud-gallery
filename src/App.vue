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
import { RouterView } from 'vue-router'
import TheNavbar from '@/components/Navbar/TheNavbar.vue'
import AppBackground from '@/components/AppBackground.vue'
import AppHotifications from './components/AppHotifications.vue'
import { useServerStore } from '@/stores/serverStore'
import { onMounted } from 'vue'

const server = useServerStore()
onMounted(() => { server.getDataHandler() })
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
