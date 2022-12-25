<template>
<FoldersIcon class="folder-icon" @click="isActive = !isActive" />
<Transition name="main">
  <div v-show="isActive" class="menu-wrapper">
    <small>Текущая</small>
    <NavFolderItem data-idx="0" :type="main.curFolder.type" :name="main.curFolder.name" />
    <small>Доступные</small>
    <NavFolderItem
      v-for="(folder, idx) in main.folders"
      :key="folder"
      :data-idx="idx"
      :type="folder.type"
      :name="folder.name"
    />
  </div>
</Transition>
</template>

<script setup lang="ts">
import FoldersIcon from '@/assets/svg/FoldersIcon.vue'
import NavFolderItem from './NavFolderItem.vue'
import { ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useMainStore } from '@/stores/mainStore'
import { onMounted } from 'vue'

const main = useMainStore()
const isActive = ref<boolean>(false)

useEventListener(document, 'click', (evt: any) => {
  if (!evt.target.closest(['.folder-icon', '.menu-wrapper']))
    isActive.value = false
  if (evt.target.closest(['.folder'])) {
    main.curFolder = main.folders[evt.target.dataset.idx]
    main.getData()
    isActive.value = false
  }
})

onMounted(() => { main.getFolders(); main.getData() })
</script>

<style scoped lang="scss">
.menu-wrapper {
  display: flex;
  justify-content: flex-start;
  position: fixed;
  top: 76px;
  left: 15px;
  z-index: 40;
  display: flex;
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  padding: var(--space);
  border-radius: var(--br-rad);
  flex-direction: column;
  gap: var(--space);
}
</style>
