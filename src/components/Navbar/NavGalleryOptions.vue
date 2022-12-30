<template>
<div class="options">
  <RouterLink to="/"><LogoIcon /></RouterLink>
  <div class="_br"></div>
  <NavFoldersMenu />
  <AppHashInput :is-search="true" @update:hashModel="(value) => searchTags = value" />
  <div class="stable"><FilterIcon /></div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LogoIcon from '@/assets/svg/LogoIcon.vue'
import FilterIcon from '@/assets/svg/FilterIcon.vue'
import NavFoldersMenu from './NavFoldersMenu.vue'
import AppHashInput from '../AppHashInput.vue'

const searchTags = ref<string>('')
</script>

<style scoped lang="scss">
.options {
  display: flex;
  align-items: center;
  gap: var(--space);
  height: 100%;
}

.stable {
  display: flex;
  align-items: center;
  svg {
    min-width: 24px !important;
  }
}
</style>