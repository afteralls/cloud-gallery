<template>
  <TheNavbar />
  <AppHotifications />
  <AppBackground class="app-background" />
  <div class="app-wrapper"></div>
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
</script>

<style scoped lang="scss">
.app-wrapper, .app-background {
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
}

.app-wrapper {
  backdrop-filter: blur(40px);
  background-color: var(--tp-c);
  z-index: -1;
}

.app-background { z-index: -2; }
</style>
