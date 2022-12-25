<template>
<nav ref="navSize" class="nav-wrapper">
  <div class="_container">
    <div class="nav">
      <div class="_row" style="position: relative">
        <Transition name="nav" mode="out-in">
          <RouterLink v-if="$route.path !== '/gallery'" to="/" class="_row">
            <LogoIcon />
            <h3>{{ width > 375 ? $i18n('nav.name') : $i18n('nav.name_sh') }}</h3>
          </RouterLink>
          <NavGalleryOptions v-else />
        </Transition>
      </div>
      <div v-if="width > 900" class="_row">
        <NavThemeSwitcher />
        <div class="_br"></div>
        <TranslateIcon @click="changeLang" />
        <div class="_br"></div>
        <NavContacts />
      </div>
      <NavMobMenu v-else>
        <template #theme><NavThemeSwitcher /></template>
        <template #translation><TranslateIcon @click="changeLang" /></template>
        <template #contacts><NavContacts /></template>
      </NavMobMenu>
    </div>
  </div>
</nav>
</template>

<script setup lang="ts">
import LogoIcon from '@/assets/svg/LogoIcon.vue'
import NavContacts from './NavContacts.vue'
import TranslateIcon from '@/assets/svg/TranslateIcon.vue'
import NavThemeSwitcher from './NavThemeSwitcher.vue'
import NavMobMenu from './NavMobMenu.vue'
import NavGalleryOptions from './NavGalleryOptions.vue'

import { useResizeObserver } from '@vueuse/core'
import { inject, ref, onMounted } from 'vue'

const changeLang = inject(import.meta.env.VITE_I18N)
const navSize = ref<HTMLInputElement | null>(null)
const width = ref<number>(0)

useResizeObserver(navSize, entries => { width.value = entries[0].contentRect.width })
onMounted(() => { width.value = window.window.innerWidth })
</script>

<style lang="scss">
.nav-wrapper {
  position: fixed;
  box-sizing: border-box;
  top: 0;
  width: 100%;
  z-index: 10;
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
}

.nav {
  display: flex;
  justify-content: space-between;
  gap: var(--space);
  padding: var(--space);
  height: 60px;

  h3 { text-transform: uppercase; }

  svg {
    height: 24px;
    width: auto;
    cursor: pointer;
  }
}

.nav {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.2s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}
</style>
