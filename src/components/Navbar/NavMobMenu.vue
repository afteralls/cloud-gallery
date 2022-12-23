<template>
<NavMenuIcon @click="isActive = !isActive" :class="{ 'active': isActive }" />
<Transition name="main">
  <div v-show="isActive" class="menu-wrapper">
    <div class="menu">
      <slot name="theme"></slot>
      <div class="_row">
        <slot name="translation"></slot>
        <div class="_br"></div>
        <slot name="contacts"></slot>
      </div>
    </div>
  </div>
</Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavMenuIcon from './NavMenuIcon.vue'
import { useEventListener } from '@vueuse/core'

const isActive = ref(false)
useEventListener(document, 'click', (evt: any) => {
  if (!evt.target.closest(['.menu-icon', '.menu-wrapper']))
    isActive.value = false
})
</script>

<style scoped lang="scss">
.menu-wrapper {
  position: fixed;
  top: 72px;
  right: 15px;
  width: 200px;
  height: 100px;
  z-index: 40;
}

.menu {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: var(--bg-c);
  padding: var(--space);
  border-radius: var(--br-rad);
  flex-direction: column;
  gap: var(--space);
  justify-content: center;
}
</style>
