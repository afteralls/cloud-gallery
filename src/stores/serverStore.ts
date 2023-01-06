import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  getStorage,
  ref as Ref,
  listAll,
  uploadBytesResumable,
  getBlob,
  uploadBytes,
  getDownloadURL,
  getMetadata,
  deleteObject,
  updateMetadata
} from 'firebase/storage'
import type { StorageReference } from 'firebase/storage'
import { useAuthStore } from './authStore'
import { useNotfStore } from './notfStore'
import { useCoreStore } from './coreStore'
import type { Image } from '@/types'
import Compressor from 'compressorjs'

export const useServerStore = defineStore('server', () => {
  const auth = useAuthStore()
  const notf = useNotfStore()
  const core = useCoreStore()
  const storage = getStorage()

  const hashDataRef = ref<StorageReference>()
  const imageDataRef = ref<StorageReference>()

  const curPath = computed(() =>
    core.curFolder.type === 'global'
      ? `gallery/${core.curFolder.name}`
      : `users/${auth.email}/${core.curFolder.name}`
  )

  const getFolderList = async (foldRef: any, type: string) => {
    const folderList = await listAll(foldRef)
    folderList.prefixes.forEach((folderRef: any) => {
      core.foldersCollection.push({ name: folderRef.name, type })
    })
  }

  const globalFoldersRef = Ref(storage, 'gallery')
  const privatFoldersRef = Ref(storage, `users/${auth.email}`)

  const getFolders = async () => {
    core.foldersCollection = []
    await getFolderList(globalFoldersRef, 'global')
    if (auth.isAuthenticated)
      await getFolderList(privatFoldersRef, 'local')
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
    hashDataRef.value = Ref(storage, `${curPath.value}/hashData.json`)
    imageDataRef.value = Ref(storage, `${curPath.value}/imageData.json`)
    core.hashtagsCollection = []; core.imageCollection = []

    await getBlob(hashDataRef.value).then(async responce => {
      const data = await new Response(responce).text()
      if (data) core.hashtagsCollection = JSON.parse(data)
    })

    await getBlob(imageDataRef.value).then(async responce => {
      const data = await new Response(responce).text()
      if (data) core.imageCollection = JSON.parse(data)
    })

    core.imageCollection.map(img => {
      if (!core.dateCollection.includes(img.created)) core.dateCollection.push(img.created)
      if (!core.uploaders.includes(img.uploader)) core.uploaders.push(img.uploader)
    })
    
    core.curDate = core.dateCollection[0]
    core.curUploader = core.uploaders[0]
  }

  const isUploading = ref<boolean>(false)

  const uploadImages = (file: File, blocks: NodeListOf<Element>, idx: number, tags: string) => {
    const currentTags = tags.trim()

    const metadata = {
      customMetadata: {
        hashtags: currentTags,
        uploader: auth.email
      }
    }

    const imageRef = Ref(storage, `${curPath.value}/${file.name}`)
    const uploadTask = uploadBytesResumable(imageRef, file, metadata)

    uploadTask.on('state_changed', snapshot => {
      const percentage = parseInt(((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed())
      const block: any = blocks[idx]
      if (percentage > 30) { block.textContent = percentage + '%' }
      block.style.width = percentage + '%'
    }, () => {}, async () => {
      notf.addNotification('Изображение успешно загружено')

      core.imageCollection.push({
        name: file.name,
        hashtags: currentTags,
        src: await getDownloadURL(uploadTask.snapshot.ref),
        uploader: auth.email,
        created: await getMetadata(uploadTask.snapshot.ref)
        .then(meta => meta.timeCreated.split('T')[0])
      })

      core.clientImages = core.clientImages?.filter((f: File) => f.name !== file.name)
      core.previewImages.forEach((f, idx: number) => {
        if (f.name === file.name)
          core.previewImages.splice(idx, 1)
      })

      if (!core.clientImages?.length) {
        const imageBlob = new Blob([JSON.stringify(core.imageCollection)], { type: 'application/json' })
        uploadBytes(imageDataRef.value as StorageReference, imageBlob)

        currentTags.split(' ').forEach((tag: string) => {
          if (!core.hashtagsCollection.includes(tag))
            core.hashtagsCollection.push(tag)
        })

        const tagBlob = new Blob([JSON.stringify(core.hashtagsCollection)], { type: 'application/json' })
        uploadBytes(hashDataRef.value as StorageReference, tagBlob)
        isUploading.value = false
      }
    })
  }

  const uploadHandler = (toCompress: boolean, items: NodeListOf<Element>, tags: string) => {
    if (toCompress) {
      core.clientImages?.forEach((file, idx) => {
        new Compressor(file, {
          quality: 0.6,
          success (result) {
            uploadImages(result as File, items, idx, tags)
          }
        })
      })
    } else {
      core.clientImages?.forEach((file, idx) => {
        uploadImages(file, items, idx, tags)
      })
    }
  }

  const deleteHandler = (array: Image[], imageName: string) => {
    array.forEach((f, i) => { if (f.name === imageName) { array.splice(i, 1) } })
  }

  const deleteImage = async (e: any) => {
    const { name } = e.target.dataset
    const imageRef = Ref(storage, `${curPath.value}/${name}`)
    
    await deleteObject(imageRef).then(async () => {
      deleteHandler(core.imageCollection, name)
      deleteHandler(core.galleryCollection, name)
      const imageDataBlob = new Blob([JSON.stringify(core.imageCollection)], { type: 'application/json' })
      uploadBytes(imageDataRef.value as StorageReference, imageDataBlob)
      notf.addNotification('Изображение успешно удалено')
    }).catch(() => { notf.addNotification('Упс... Что-то пошло не так') })
  }

  const updateImageData = (name: string, tags: string) => {
    const currentTags = core.getValidTagsCollection(tags)
    const imageRef = Ref(storage, `${curPath.value}/${name}`)

    const newMetadata = {
      customMetadata: {
        hashtags: tags
      }
    }

    updateMetadata(imageRef, newMetadata).then(() => {
      core.imageCollection.forEach(image => {
        if (image.name === name) { image.hashtags = tags }
      })

      const imageDataBlob = new Blob([JSON.stringify(core.imageCollection)], { type: 'application/json' })
      uploadBytes(imageDataRef.value as StorageReference, imageDataBlob)

      currentTags.forEach((tag: string) => {
        if (!core.hashtagsCollection.includes(tag)) core.hashtagsCollection.push(tag)
      })

      const tagBlob = new Blob([JSON.stringify(core.hashtagsCollection)], { type: 'application/json' })
      uploadBytes(hashDataRef.value as StorageReference, tagBlob)
      notf.addNotification('Метаданные успешно обновлены')
    }).catch(() => { notf.addNotification('Упс... Что-то пошло не так') })
  }

  const deleteTag = (idx: number) => {
    core.hashtagsCollection.splice(idx, 1)
    const tagBlob = new Blob([JSON.stringify(core.hashtagsCollection)], { type: 'application/json' })
    uploadBytes(hashDataRef.value as StorageReference, tagBlob)
    notf.addNotification('Тег успешно удалён')
  }

  return {
    createFolder,
    getFolders,
    getData,
    uploadHandler,
    deleteImage,
    updateImageData,
    isUploading,
    deleteTag
  }
})
