<template>
  <div class="settings-row">
    <div class="upload-settings">
      <small>Введите общие теги</small>
      <AppHashInput
        :modal="uploadTags"
        @update:hash-model="(value) => { uploadTags = value }"
        @update:add-tag="(value) => { uploadTags += value }"
      />
      <small>Папка для загрузки</small>
      <AppFolderItem
        @click="isOpen = true"
        data-idx="0"
        :type="core.curFolder.type"
        :name="core.curFolder.name"
      />
    </div>
    <div class="upload-settings">
      <div class="_cb-wrapper">
        <Transition name="core"><CheckIcon v-if="toCompress" /></Transition>
        <input v-model="toCompress" id="min" type="checkbox">
        <label for="min"><small>Сжать изображения</small></label>
      </div>
      <div class="tip-row">
        <InfoIcon />
        <h5>Опция применяется<br />ко всем изображениям</h5>
      </div>
      <div
        @click="uploadHandler"
        :class="{ _btn: true, _disabled: server.isUploading || !uploadTags || !core.clientImages?.length }"
      ><small>Загрузить</small></div>
    </div>
  </div>
  <AppModal :is-open="isOpen" @close-modal="isOpen = false">
    <div @click="changeFolder" class="folder-list">
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
  </AppModal>
</template>

<script setup lang="ts">
import CheckIcon from '@/assets/svg/CheckIcon.vue'
import InfoIcon from '@/assets/svg/InfoIcon.vue'
import AppFolderItem from '@/components/AppFolderItem.vue'
import AppModal from '../AppModal.vue'
import AppHashInput from '../AppHashInput.vue'
import { useCoreStore } from '@/stores/coreStore'
import { useServerStore } from '@/stores/serverStore'
import { ref, onMounted } from 'vue'

const core = useCoreStore()
const server = useServerStore()
const isOpen = ref<boolean>(false)
const toCompress = ref<boolean>(false)
const uploadTags = ref<string>('')

const changeFolder = (evt: any) => {
  if (evt.target.closest(['.folder'])) {
    core.curFolder = core.foldersCollection[evt.target.dataset.idx]
    server.getData()
    isOpen.value = false
  }
}

const uploadHandler = () => {
  document.querySelectorAll('.remove').forEach(e => e.remove())
  server.isUploading = true
  const items = document.querySelectorAll('.progress')
  server.uploadHandler(toCompress.value, items, uploadTags.value)
}

onMounted(() => { server.getFolders(); server.getData() })
</script>

<style scoped lang="scss">
.settings-row {
  display: flex;
  justify-content: center;
  gap: var(--space);

  @media(max-width: 525px) {
    flex-direction: column;
  }
}

.upload-wrapper {
  display: flex;
  height: 100%;
}

.tip-row {
  display: flex;
  gap: var(--space);
  align-items: center;
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

  @media(max-width: 525px) {
    input {
      width: 100% !important;
    }
  }
}
</style>