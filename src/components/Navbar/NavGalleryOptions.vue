<template>
  <div class="options">
    <RouterLink to="/"><LogoIcon /></RouterLink>
    <div class="_br"></div>
    <div class="options_folder">
      <FoldersIcon />
    </div>
    <div class="options__search">
      <input type="text" placeholder="#Art #Nature">
      <SearchIcon class="options__search-icon" />
    </div>
    <div class="stable"><FilterIcon /></div>
  </div>
</template>

<script setup lang="ts">
import SearchIcon from '@/assets/svg/SearchIcon.vue'
import LogoIcon from '@/assets/svg/LogoIcon.vue'
import FilterIcon from '@/assets/svg/FilterIcon.vue'
import FoldersIcon from '@/assets/svg/FoldersIcon.vue'
import { useMainStore } from '@/stores/mainStore'

const main = useMainStore()
console.log(main.folders)
</script>

<style scoped lang="scss">
.options {
  display: flex;
  align-items: center;
  gap: var(--space);
  height: 100%;

  &__search {
    display: flex;
    align-items: center;
    position: relative;
    
    input {
      width: 200px;
      box-sizing: border-box;
      padding: 0 27px 5px 0;
      background-color: transparent;
      border-radius: 0;
      border-bottom: 2px solid var(--txt-c);
    }

    svg { height: 22px; }

    &-icon {
      position: absolute;
      right: 0;
      bottom: 5px;
    }

    @media(max-width: 420px) {
      input {
        width: 100%;
      }
    }
  }
}

.stable {
  display: flex;
  align-items: center;
  svg {
    min-width: 24px !important;
  }
}
</style>