import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotfStore } from './notfStore'
import { useStorage } from '@vueuse/core'
import type { Folder, PreviewInfo, Image } from '@/types'

export const useCoreStore = defineStore('core', () => {
  const notf = useNotfStore()

  const foldersCollection = ref<Folder[]>([])
  const imageCollection = ref<Image[]>([])
  const hashtagsCollection = ref<string[]>([])

  const clientImages = ref<File[] | null | undefined>([])
  const previewImages = ref<PreviewInfo[]>([])
  const galleryCollection = ref<Image[]>([])

  const curFilter = ref<string>('date')
  const curFolder = useStorage<Folder>('curFolder', { name: 'images', type: 'global' })

  const dateCollection = ref<string[]>(['Не выбрано'])
  const curDate = ref<string>(dateCollection.value[0])
  const uploaders = ref<string[]>(['Не выбрано'])
  const curUploader = ref<string>(uploaders.value[0])

  const getValidTagsCollection = (hashtags: string) => hashtags.trim().split(' ')

  const search = (modal: string) => {
    galleryCollection.value = []
    const currentTagsCollection: string[] = getValidTagsCollection(modal)
      currentTagsCollection.forEach((tag, idx) => {
        if(!tag)
          currentTagsCollection.splice(idx, 1)
      })
    
    imageCollection.value.forEach(image => {
      const imageHashtagsCollection: string[] = getValidTagsCollection(image.hashtags)    
      if (currentTagsCollection.length > 1) {
        const allTags = [imageHashtagsCollection, currentTagsCollection]
        const deepValidate = allTags.reduce((p, c) => p.filter(e => c.includes(e)))
        if (deepValidate.length === currentTagsCollection.length)
          galleryCollection.value.push(image)
      } else if (currentTagsCollection.length === 1) {
        if (imageHashtagsCollection.includes(currentTagsCollection[0]))
          galleryCollection.value.push(image)
      }
    })

    if (!galleryCollection.value.length)
      notf.addNotification('Совпадений не найдено...')
  }
  
  const deepSearch = () => {
    galleryCollection.value = []
    if (curFilter.value === 'date') {
      imageCollection.value.forEach(image => {
        if (curDate.value === image.created)
          galleryCollection.value.push(image)
      })
    } else if (curFilter.value === 'user') {
      imageCollection.value.forEach(image => {
        if (curUploader.value === image.uploader)
          galleryCollection.value.push(image)
      })
    }
    if (!galleryCollection.value.length)
      notf.addNotification('Совпадений не найдено...')
  }

  return {
    foldersCollection,
    curFolder,
    imageCollection,
    hashtagsCollection,
    clientImages,
    previewImages,
    galleryCollection,
    search,
    curDate,
    dateCollection,
    curUploader,
    uploaders,
    deepSearch,
    curFilter,
    getValidTagsCollection
  }
})
