<template>
<section class="settings-row">
  <div class="upload-settings _tp-wp _column">
    <small>{{ $i18n('upload.setTags') }}</small>
    <AppHashInput
      :model="uploadTags"
      @update-model="(value) => { uploadTags = value }"
      @add-tag="(value) => { uploadTags += value }"
    />
    <small>{{ $i18n('upload.setFold') }}</small>
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
      <label for="min"><small>{{ $i18n('upload.compress') }}</small></label>
    </div>
    <div class="_row">
      <InfoIcon />
      <h5>{{ $i18n('upload.setTip') }}</h5>
    </div>
    <div
      @click="uploadHandler"
      :class="{
        '_btn': true,
        '_disabled': server.isUploading || !uploadTags || !core.clientImages?.length
      }"
    ><small>{{ $i18n('upload.setUpload') }}</small></div>
  </div>
</section>
<AppModal :is-open="showFolderList" @close-modal="showFolderList = false">
  <AppFolderList @close-folder-list="showFolderList = false" />
</AppModal>
</template>

<script setup lang="ts">
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