<template>
  <div @click="changeFolder" class="_column">
    <small>{{ $i18n('app.curColder') }}</small>
    <AppFolderItem data-idx="0" :type="core.curFolder.type" :name="core.curFolder.name" />
    <small>{{ $i18n('app.avColder') }}</small>
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
const emit = defineEmits<{
  (e: 'closeFolderList'): void 
}>()

const core = useCoreStore()
const server = useServerStore()

const changeFolder = (evt: MouseEvent) => {
  const target = evt.target as HTMLElement
  if (target.closest('.folder')) {
    core.curFolder = core.foldersCollection[+target.dataset.idx!]
    server.getData()
    emit('closeFolderList')
  }
}
</script>
