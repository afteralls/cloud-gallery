<template>
  <div class="settings-row">
    <div class="upload-settings _tp-wp _column">
      <small>Введите общие теги</small>
      <AppHashInput
        :model="uploadTags"
        @update-model="(value) => { uploadTags = value }"
        @add-tag="(value) => { uploadTags += value }"
      />
      <small>Папка для загрузки</small>
      <AppFolderItem
        @click="showFolderList = true"
        data-idx="0"
        :type="core.curFolder.type"
        :name="core.curFolder.name"
      />
    </div>
    <div class="upload-settings _tp-wp _column">
      <div class="_cb-wrapper">
        <Transition name="core"><CheckIcon v-if="toCompress" /></Transition>
        <input v-model="toCompress" id="min" type="checkbox">
        <label for="min"><small>Сжать изображения</small></label>
      </div>
      <div class="_row">
        <InfoIcon />
        <h5>Опция применяется<br />ко всем изображениям</h5>
      </div>
      <div
        @click="uploadHandler"
        :class="{ _btn: true, _disabled: server.isUploading || !uploadTags || !core.clientImages?.length }"
      ><small>Загрузить</small></div>
    </div>
  </div>
  <AppModal :is-open="showFolderList" @close-modal="showFolderList = false">
    <AppFolderList @close-folder-list="showFolderList = false" />
  </AppModal>
</template>

<script setup lang="ts">
import CheckIcon from '@/assets/svg/CheckIcon.vue'
import InfoIcon from '@/assets/svg/InfoIcon.vue'
import AppFolderItem from '@/components/AppFolderItem.vue'
import AppModal from '../AppModal.vue'
import AppFolderList from '../AppFolderList.vue'
import AppHashInput from '../AppHashInput.vue'
import { useCoreStore } from '@/stores/coreStore'
import { useServerStore } from '@/stores/serverStore'
import { ref } from 'vue'

const core = useCoreStore()
const server = useServerStore()

const showFolderList = ref<boolean>(false)
const toCompress = ref<boolean>(false)
const uploadTags = ref<string>('')

const uploadHandler = () => {
  document.querySelectorAll('.remove').forEach(e => e.remove())
  server.isUploading = true
  const items = document.querySelectorAll('.progress')
  server.uploadHandler(toCompress.value, items, uploadTags.value)
}
</script>

<style scoped lang="scss">
.settings-row {
  display: flex;
  gap: var(--space);

  @media(max-width: 525px) {
    flex-direction: column;
  }
}

.upload-settings {
  justify-content: center;

  @media(max-width: 525px) {
    width: 100%;
  
    input {
      width: 100% !important;
    }
  }
}
</style>