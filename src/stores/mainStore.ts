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
  getMetadata
} from 'firebase/storage'
import { useAuthStore } from './authStore'
import { useNotfStore } from './notfStore'
import Compressor from 'compressorjs'

interface Folder { name: string, type: string }
interface PreviewInfo { name?: string, src?: string, size?: string }
interface ImageCollection {
  name: string,
  hashtags: string,
  src: string,
  uploader: string,
  created: string
}

export const useMainStore = defineStore('main', () => {
  const storage = getStorage()
  const auth = useAuthStore()
  const notf = useNotfStore()

  const foldersCollection = ref<Folder[]>([])
  const imageCollection = ref<ImageCollection[]>([])
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

  const galleryCollection = ref<ImageCollection[]>([])
  const searchTags = ref<string>('')
  const search = () => {
    galleryCollection.value = []
    const searchCollection: string[] = searchTags.value.match(' ')
      ? searchTags.value.split(' ')
      : [searchTags.value]
    searchCollection.forEach((tag, idx) => { if(!tag) searchCollection.splice(idx, 1) })
    
    imageCollection.value.forEach(image => {
      const imageTagsCollection: string[] = image.hashtags.trim().split(' ')      
      if (searchCollection.length > 1) {
        const allTags = [imageTagsCollection, searchCollection]
        const deepValidate = allTags.reduce((p, c) => p.filter(e => c.includes(e)))
        if (deepValidate.length === searchCollection.length) galleryCollection.value.push(image)
      } else if (searchCollection.length === 1) {
        if (imageTagsCollection.includes(searchCollection[0])) galleryCollection.value.push(image)
      }
    })
    if (!galleryCollection.value.length) notf.addNotification('Совпадений не найдено...')
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
    search
  }
})
