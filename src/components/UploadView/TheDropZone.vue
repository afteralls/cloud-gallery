<template>
<div ref="dropZoneRef" class="drop-zone _tp-wp">
  <div class="drop-container _center">
    <div @click="open({ accept: 'image/png, image/jpeg, image/webp' })" class="add _absolute"></div>
    <small>{{ !isOverDropZone ? 'Нажмите на поле или перетащите сюда нужные файлы' : 'Бросайте!' }}</small>
  </div>
</div>
</template>

<script setup lang="ts">
const core = useCoreStore()
const { files, open, reset } = useFileDialog()
const dropZoneRef = ref<HTMLDivElement>()
const onDrop = (files: File[] | null) => { addFiles(files) }
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

const addFiles = (files: File[] | null | FileList) => {
  const orderList: File[] = Array.from((files as File[] | FileList))
  orderList.forEach((file: File) => { core.clientImages?.push(file) })
  previewHandler(orderList)
}

watch(files, (fileList) => {
  if (fileList)
    addFiles(fileList)
  reset()
})

const previewHandler = (orderlist: File[]) => {
  orderlist.forEach(file => {
    if (!file.type.match('image'))
      return
    const reader = new FileReader()

    reader.onload = (e) => {
      const image = new Image()
      image.onload = () => {
        core.previewImages.push({
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
</script>

<style scoped lang="scss">
.drop-zone {
  width: 350px;
  cursor: pointer;

  @media(max-width: 910px) {
    width: auto;
  }
}

.drop-container {
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

.add { opacity: 0; }
</style>
