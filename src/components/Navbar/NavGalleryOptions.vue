<template>
<div class="options">
  <RouterLink to="/"><LogoIcon /></RouterLink>
  <div class="_br"></div>
  <NavFoldersMenu />
  <AppHashInput :is-search="true" @update:hashModel="(value) => main.searchTags = value" />
  <div @click="showFilters = true" class="stable"><FilterIcon /></div>
  <AppModal :is-open="showFilters" @close-modal="showFilters = false">
    <div class="filters">
      <small>По тегам</small>
      <AppHashInput @update:hashModel="(value) => filterTags = value" />
      <small></small>
    </div>
  </AppModal>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LogoIcon from '@/assets/svg/LogoIcon.vue'
import FilterIcon from '@/assets/svg/FilterIcon.vue'
import NavFoldersMenu from './NavFoldersMenu.vue'
import AppHashInput from '../AppHashInput.vue'
import AppModal from '../AppModal.vue'
import { useMainStore } from '@/stores/mainStore'

const main = useMainStore()
const showFilters = ref<boolean>(false)
const filterTags = ref<string>('')
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

.filters {
  display: flex;
  gap: var(--space);
}
</style>