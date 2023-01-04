import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import {
  getStorage,
  ref as Ref,
  listAll,
  uploadBytesResumable,
  getBlob,
  uploadBytes,
  getDownloadURL,
  getMetadata,
  deleteObject
} from 'firebase/storage'
import { useAuthStore } from './authStore'
import { useNotfStore } from './notfStore'
import Compressor from 'compressorjs'

interface Folder { name: string, type: string }
interface PreviewInfo { name?: string, src?: string, size?: string }
export interface Image { name: string, hashtags: string, src: string, uploader: string, created: string }

export const useMainStore = defineStore('main', () => {
  const storage = getStorage()
  const auth = useAuthStore()
  const notf = useNotfStore()

  const foldersCollection = ref<Folder[]>([])
  const imageCollection = ref<Image[]>([])
  const hashCollection = ref<string[]>([])

  const clientImages = ref<File[] | null | undefined>([])
  const previewImages = ref<PreviewInfo[]>([])

  const curFolder = useStorage<Folder>('curFolder', { name: 'images', type: 'global' })
  const globalFoldersRef = Ref(storage, 'gallery')
  const localFoldersRef = Ref(storage, `users/${auth.email}`)

  const curPath = computed(() => {
    return curFolder.value.type === 'global'
      ? `gallery/${curFolder.value.name}`
      : `users/${auth.email}/${curFolder.value.name}`
  })

  const curHashDataRef = ref<any>()
  const curImageDataRef = ref<any>()

  const getFolderList = async (foldRef: any, type: string) => {
    const folderList = await listAll(foldRef)
    folderList.prefixes.forEach((folderRef: any) => {
      foldersCollection.value.push({ name: folderRef.name, type })
    })
  }

  const getFolders = async () => {
    foldersCollection.value = []
    await getFolderList(globalFoldersRef, 'global')
    if (auth.isAuthenticated) {
      await getFolderList(localFoldersRef, 'local')
    }
  }

  const getStorageRef = async (name: string, type: string, fileName: string) => {
    const imageDataRef = type === 'global'
      ? Ref(storage, `gallery/${name}/${fileName}.json`)
      : Ref(storage, `users/${auth.email}/${name}/${fileName}.json`)
    const defBlob = new Blob([JSON.stringify([])], { type: 'application/json' })
    uploadBytes(imageDataRef, defBlob)
  }

  const createFolder = async (name: string, type: string) => {
    await getStorageRef(name, type, 'imageData')
    await getStorageRef(name, type, 'hashData')
    notf.addNotification('Папка успешно создана!')
  }

  const dateCollection = ref<string[]>(['Не выбрано'])
  const curDate = ref<string>(dateCollection.value[0])
  const uploaders = ref<string[]>(['Не выбрано'])
  const curUploader = ref<string>(uploaders.value[0])

  const getData = async () => {
    curHashDataRef.value = Ref(storage, `${curPath.value}/hashData.json`)
    curImageDataRef.value = Ref(storage, `${curPath.value}/imageData.json`)
    hashCollection.value = []; imageCollection.value = []

    await getBlob(curHashDataRef.value).then(async responce => {
      const data = await new Response(responce).text()
      if (data) hashCollection.value = JSON.parse(data)
    })

    await getBlob(curImageDataRef.value).then(async responce => {
      const data = await new Response(responce).text()
      if (data) imageCollection.value = JSON.parse(data)
    })

    imageCollection.value.map(img => {
      if (!dateCollection.value.includes(img.created))
        dateCollection.value.push(img.created)
      if (!uploaders.value.includes(img.uploader))
        uploaders.value.push(img.uploader)
    })

    curDate.value = dateCollection.value[0]
    curUploader.value = uploaders.value[0]
  }

  const isUploading = ref<boolean>(false)
  const uploadTags = ref<string>('')
  const uploadImages = (file: File, blocks: NodeListOf<Element>, idx: number) => {
    const currentTags = uploadTags.value.trim()
    const metadata = { customMetadata: { hashtags: currentTags, uploader: auth.email } }
    const imageRef = Ref(storage, `${curPath.value}/${file.name}`)
    const uploadTask = uploadBytesResumable(imageRef, file, metadata)
    uploadTask.on('state_changed', snapshot => {
      const percentage = parseInt(((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed())
      const block: any = blocks[idx]
      if (percentage > 30) { block.textContent = percentage + '%' }
      block.style.width = percentage + '%'
    }, e => { console.log(e) }, async () => {
      notf.addNotification('Изображение успешно загружено')
      imageCollection.value.push({
        name: file.name,
        hashtags: currentTags,
        src: await getDownloadURL(uploadTask.snapshot.ref),
        uploader: auth.email,
        created: await getMetadata(uploadTask.snapshot.ref).then(meta => meta.timeCreated.split('T')[0])
      })
      clientImages.value = clientImages.value?.filter((f: any) => f.name !== file.name)
      previewImages.value.forEach((f, i) => {
        if (f.name === file.name) previewImages.value.splice(i, 1)
      })
      if (!clientImages.value?.length) {
        const imageBlob = new Blob([JSON.stringify(imageCollection.value)], { type: 'application/json' })
        uploadBytes(curImageDataRef.value, imageBlob)
        currentTags.split(' ').forEach(tag => {
          if (!hashCollection.value.includes(tag)) hashCollection.value.push(tag)
        })
        const tagBlob = new Blob([JSON.stringify(hashCollection.value)], { type: 'application/json' })
        uploadBytes(curHashDataRef.value, tagBlob)
        isUploading.value = false
      }
    })
  }

  const uploadHandler = (toCompress: boolean, items: NodeListOf<Element>) => {
    if (toCompress) {
      clientImages.value?.forEach((file, idx) => {
        new Compressor(file, {
          quality: 0.6,
          success (result) { uploadImages(result as File, items, idx) }
        })
      })
    } else { clientImages.value?.forEach((file, idx) => { uploadImages(file, items, idx) }) }
  }

  const galleryCollection = ref<Image[]>([])
  const findHandler = (inputValue: string, resultCollection: Image[]) => {
    galleryCollection.value = []
    const tagsCollection: string[] = inputValue.match(' ')
      ? inputValue.split(' ')
      : [inputValue]
      tagsCollection.forEach((tag, idx) => { if(!tag) tagsCollection.splice(idx, 1) })
    
    imageCollection.value.forEach(image => {
      const imageTagsCollection: string[] = image.hashtags.trim().split(' ')      
      if (tagsCollection.length > 1) {
        const allTags = [imageTagsCollection, tagsCollection]
        const deepValidate = allTags.reduce((p, c) => p.filter(e => c.includes(e)))
        if (deepValidate.length === tagsCollection.length) resultCollection.push(image)
      } else if (tagsCollection.length === 1) {
        if (imageTagsCollection.includes(tagsCollection[0])) resultCollection.push(image)
      }
    })
  }

  const searchTags = ref<string>('')
  const search = () => {
    const searchCollection: Image[] = []
    findHandler(searchTags.value, searchCollection)
    galleryCollection.value = searchCollection
    if (!galleryCollection.value.length) notf.addNotification('Совпадений не найдено...')
  }

  const curFilter = ref<string>('date')
  const deepSearch = () => {
    galleryCollection.value = []
    const deepSearchCollection: Image[] = []
    if (curFilter.value === 'date') {
      imageCollection.value.forEach(image => {
        if (curDate.value === image.created) deepSearchCollection.push(image)
      })
    } else if (curFilter.value === 'user') {
      imageCollection.value.forEach(image => {
        if (curUploader.value === image.uploader) deepSearchCollection.push(image)
      })
    }
    galleryCollection.value = deepSearchCollection
    if (!galleryCollection.value.length) notf.addNotification('Совпадений не найдено...')
  }

  const deleteHandler = (array: Image[], imageName: string) => {
    array.forEach((f, i) => { if (f.name === imageName) { array.splice(i, 1) } })
  }

  const deleteImage = (e: any) => {
    const { name } = e.target.dataset
    const imageRef = Ref(storage, `${curPath.value}/${name}`)
    
    deleteObject(imageRef).then(async () => {
      deleteHandler(imageCollection.value, name)
      deleteHandler(galleryCollection.value, name)
      const imageDataBlob = new Blob([JSON.stringify(imageCollection.value)], { type: 'application/json' })
      uploadBytes(curImageDataRef.value, imageDataBlob)
      notf.addNotification('Изображение успешно удалено')
    }).catch(() => {
      notf.addNotification('Упс... Что-то пошло не так')
    })
  }

  const updateTags = ref<string>('')
  const updateImageData = (name: string, hashtags: string) => {
    updateTags.value = hashtags
  }

  return {
    foldersCollection,
    curFolder,
    createFolder,
    getFolders,
    getData,
    imageCollection,
    hashCollection,
    clientImages,
    previewImages,
    isUploading,
    uploadTags,
    uploadHandler,
    galleryCollection,
    searchTags,
    search,
    curDate,
    dateCollection,
    curUploader,
    uploaders,
    deepSearch,
    curFilter,
    deleteImage,
    updateImageData,
    updateTags
  }
})
