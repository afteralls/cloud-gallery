<template>
<FoldersIcon class="folder-icon" @click="isActive = !isActive" />
<Transition name="main">
  <div v-show="isActive" class="menu-wrapper">
    <small>Текущая</small>
    <AppFolderItem data-idx="0" :type="main.curFolder.type" :name="main.curFolder.name" />
    <small>Доступные</small>
    <AppFolderItem
      v-for="(folder, idx) in main.foldersCollection"
      :key="folder.name"
      :data-idx="idx"
      :type="folder.type"
      :name="folder.name"
    />
  </div>
</Transition>
</template>

<script setup lang="ts">
import FoldersIcon from '@/assets/svg/FoldersIcon.vue'
import AppFolderItem from '@/components/AppFolderItem.vue'
import { ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useCoreStore } from '@/stores/coreStore'
import { useServerStore } from '@/stores/serverStore'
import { onMounted } from 'vue'

const main = useCoreStore()
const server = useServerStore()
const isActive = ref<boolean>(false)

useEventListener(document, 'click', (evt: any) => {
  if (!evt.target.closest(['.folder-icon', '.menu-wrapper']))
    isActive.value = false
  if (evt.target.closest(['.folder'])) {
    main.curFolder = main.foldersCollection[evt.target.dataset.idx]
    server.getData()
    isActive.value = false
  }
})

onMounted(() => { server.getFolders(); server.getData() })
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
  background-color: var(--bg-c);
  padding: var(--space);
  border-radius: var(--br-rad);
  flex-direction: column;
  gap: var(--space);
}

.folder-icon {
  min-width: 24px !important;
}
</style>
