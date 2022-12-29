<template>
<div class="_wrapper">
  <div class="upload">
    <ThePreview />
    <div class="upload-row">
      <TheDropZone />
      <TheUploadSettings />
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import ThePreview from '@/components/UploadView/ThePreview.vue'
import TheDropZone from '@/components/UploadView/TheDropZone.vue'
import TheUploadSettings from '@/components/UploadView/TheUploadSettings.vue'
</script>

<style scoped lang="scss">
.upload {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: var(--space);
  width: 100%;
}

.upload-row {
  display: flex;
  height: 100%;
  gap: var(--space);
}
</style>
