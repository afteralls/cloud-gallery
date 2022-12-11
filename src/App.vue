<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheNavbar from '@/components/Navbar/TheNavbar.vue'
import TheBackground from '@/components/TheBackground.vue'
</script>

<template>
  <TheNavbar />
  <TheBackground class="background" />
  <div class="wrapper"></div>
  <div class="_container">
    <RouterView v-slot="{ Component }">
      <Transition name="main" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style lang="scss">
.wrapper {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  backdrop-filter: blur(40px);
  background-color: var(--tp-c);
  z-index: -1;
}

.background {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -2;
}

.main {
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
