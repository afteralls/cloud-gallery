<template>
  <div class="_wrapper">
    <div class="upload">
      <ThePreviewSection :preview-images="previewImages" @click="deleteImage" />
      <div ref="dropZoneRef" class="drop-zone">
        <div class="drop-container">
          <input ref="addBtn" @change="addFiles(addBtn?.files)" multiple type="file" class="add">
          <small v-if="!isOverDropZone">Нажмите на поле или перетащите сюда необходимые файлы</small>
          <small v-else>Бросайте!</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDropZone } from '@vueuse/core'
import ThePreviewSection from '@/components/UploadView/ThePreviewSection.vue'
import { bytesToSize } from '@/utils/bytesToSize'

interface PreviewInfo { name?: string, src?: string, size?: string }

const dropZoneRef = ref<HTMLDivElement>()
const addBtn = ref<any>()
const clientImages = ref<File[] | null>([])
const previewImages = ref<PreviewInfo[]>([])
const onDrop = (files: File[] | null) => { addFiles(files) }
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

const addFiles = (files: File[] | null | FileList) => {
  const imgArr = Array.from((files as File[] | FileList))
  imgArr.forEach((file: File) => { clientImages.value?.push(file) })
  previewHandler()
}

const previewHandler = () => {
  clientImages.value?.forEach(file => {
    if (!file.type.match('image')) { return }
    const reader = new FileReader()

    reader.onload = (e) => {
      const image = new Image()
      image.onload = () => {
        previewImages.value.push({
          name: file.name,
          src: e.target?.result as string,
          size: bytesToSize(file.size)
        })
      }
      image.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

const deleteImage = (evt: any) => {
  const idx: number = parseInt(evt.target.dataset.idx)
  if (idx || idx === 0) {
    previewImages.value.splice(idx, 1)
    clientImages.value?.splice(idx, 1)
  }
}
</script>

<style scoped lang="scss">
.upload {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: var(--space);
  width: 100%;
}

.drop-zone {
  width: 300px;
  height: 150px;
  padding: var(--space);
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  border-radius: var(--br-rad);
}

.drop-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  padding: var(--space);
  border-radius: var(--br-rad);
  border: 3px dashed var(--accent-c);
  transition: var(--transition);
  position: relative;

  &:hover {
    border: 3px dashed var(--accent-c-h);
  }
}

.add {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
}
</style>
