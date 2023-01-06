<template>
  <div @click="changeFolder" class="_column">
    <small>Текущая</small>
    <AppFolderItem data-idx="0" :type="core.curFolder.type" :name="core.curFolder.name" />
    <small>Доступные</small>
    <AppFolderItem
      v-for="(folder, idx) in core.foldersCollection"
      :key="folder.name"
      :data-idx="idx"
      :type="folder.type"
      :name="folder.name"
    />
  </div>
</template>

<script setup lang="ts">
import AppFolderItem from '@/components/AppFolderItem.vue'
import { useCoreStore } from '@/stores/coreStore'
import { useServerStore } from '@/stores/serverStore'

const emit = defineEmits<{ (e: 'closeFolderList'): void }>()

const core = useCoreStore()
const server = useServerStore()

const changeFolder = (evt: any) => {
  if (evt.target.closest(['.folder'])) {
    core.curFolder = core.foldersCollection[evt.target.dataset.idx]
    server.getData()
    emit('closeFolderList')
  }
}
</script>
