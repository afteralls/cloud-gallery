<template>
  <div class="options">
    <RouterLink to="/"><LogoIcon /></RouterLink>
    <div class="_br"></div>
    <div class="options_folder">
      <TheSelect
        :model="main.curFolder" 
        :items="main.folders"
        @update-data="(folderName) => main.curFolder = folderName"
      />
    </div>
    <!-- <input type="text" placeholder="#Nature"> -->
  </div>
</template>

<script setup lang="ts">
import LogoIcon from '@/assets/svg/LogoIcon.vue'
import { useMainStore } from '@/stores/mainStore'
import TheSelect from './TheSelect.vue'

const main = useMainStore()
console.log(main.folders)
</script>

<style scoped lang="scss">
.options {
  display: flex;
  align-items: center;
  gap: var(--space);
  height: 100%;

  input {
    padding: calc(var(--space) / 2);
    font-size: 12px;
  }
}
</style>