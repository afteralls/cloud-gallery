<template>
  <div class="upload-settings">
    <small>Введите общие теги</small>
    <AppHashInput @update:hashModel="(value) => { main.uploadTags = value }" />
    <small>Папка для загрузки</small>
    <AppFolderItem
      @click="isOpen = true"
      data-idx="0"
      :type="main.curFolder.type"
      :name="main.curFolder.name"
    />
  </div>
  <div class="upload-settings">
    <div class="_cb-wrapper">
      <Transition name="main"><CheckIcon v-if="toCompress" /></Transition>
      <input v-model="toCompress" id="min" type="checkbox">
      <label for="min"><small>Сжать изображения</small></label>
    </div>
    <div class="_row">
      <InfoIcon />
      <h5>Опция применяется<br />ко всем изображениям</h5>
    </div>
    <div
      @click="uploadHandler"
      :class="{ _btn: true, _disabled: main.isUploading }"
    ><small>Загрузить</small></div>
  </div>
  <AppModal :is-open="isOpen" @close-modal="isOpen = false">
    <div @click="changeFolder" class="folder-list">
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
  </AppModal>
</template>

<script setup lang="ts">
import CheckIcon from '@/assets/svg/CheckIcon.vue'
import InfoIcon from '@/assets/svg/InfoIcon.vue'
import AppFolderItem from '@/components/AppFolderItem.vue'
import AppModal from '../AppModal.vue'
import AppHashInput from '../AppHashInput.vue'
import { useMainStore } from '@/stores/mainStore'
import { ref, onMounted } from 'vue'

const main = useMainStore()
const isOpen = ref<boolean>(false)
const toCompress = ref<boolean>(false)

const changeFolder = (evt: any) => {
  if (evt.target.closest(['.folder'])) {
    main.curFolder = main.foldersCollection[evt.target.dataset.idx]
    main.getData()
    isOpen.value = false
  }
}

const uploadHandler = () => {
  document.querySelectorAll('.remove').forEach(e => e.remove())
  main.isUploading = true
  const items = document.querySelectorAll('.progress')
  main.uploadHandler(toCompress.value, items)
}

onMounted(() => { main.getFolders(); main.getData() })
</script>

<style scoped lang="scss">
.upload-wrapper {
  display: flex;
  height: 100%;
}

.upload-settings {
  padding: var(--space);
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  border-radius: var(--br-rad);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space);
  min-height: 100%;
}

.upload-row {
  display: flex;
  gap: var(--space);
  align-items: center;
}

.folder-list {
  display: flex;
  flex-direction: column;
  gap: var(--space);
}
</style>