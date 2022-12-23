<template>
<nav ref="navSize" class="nav-wrapper">
  <div class="_container">
    <div class="nav">
      <RouterLink to="/" class="_row" :title="$i18n('nav.linkTitles.home')">
        <LogoIcon />
        <h3>{{ width > 375 ? $i18n('nav.name') : $i18n('nav.name_sh') }}</h3>
      </RouterLink>
      <div v-if="width > 900" class="options _row">
        <NavThemeSwitcher />
        <div class="_br"></div>
        <TranslateIcon @click="changeLang" />
        <div class="_br"></div>
        <NavContacts />
        <div class="_br"></div>
        <RouterLink to="/auth" class="_row">
          <small>Авторизоваться</small>
        </RouterLink>
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
  line-height: 0;

  h3 { text-transform: uppercase; }

  svg {
    height: 24px;
    width: auto;
    cursor: pointer;
  }
}
</style>
