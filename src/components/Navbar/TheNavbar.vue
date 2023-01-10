<template>
<nav ref="navSize" class="nav-wrapper">
  <div class="_container">
    <div class="nav">
      <div class="_row">
        <Transition name="main" mode="out-in">
          <RouterLink v-if="$route.path !== '/gallery'" to="/" class="_row">
            <div class="_i"><LogoIcon /></div>
            <h3>{{ $i18n('nav.name') }}</h3>
          </RouterLink>
          <NavGalleryOptions v-else />
        </Transition>
      </div>
      <div v-if="width > 900" class="_row">
        <NavThemeSwitcher />
        <div class="_br"></div>
        <div class="_i"><TranslateIcon @click="changeLang" /></div>
        <div class="_br"></div>
        <NavContacts />
      </div>
      <NavMobMenu v-else>
        <template #theme><NavThemeSwitcher /></template>
        <template #translation><div class="_i"><TranslateIcon @click="changeLang" /></div></template>
        <template #contacts><NavContacts /></template>
      </NavMobMenu>
    </div>
  </div>
</nav>
</template>

<script setup lang="ts">
const changeLang = inject('i18n')
const navSize = ref<HTMLInputElement | null>(null)
const width = ref<number>(0)

useResizeObserver(navSize, entries => { width.value = entries[0].contentRect.width })
</script>

<style scoped lang="scss">
.nav-wrapper {
  position: fixed;
  display: flex;
  align-items: center;
  top: 0;
  width: 100%;
  height: 60px;
  z-index: 8;
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
}

.nav {
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: var(--space);
  padding: var(--space);

  h3 { text-transform: uppercase; }
}
</style>
