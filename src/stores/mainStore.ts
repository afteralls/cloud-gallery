import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { getStorage, ref as Ref, listAll, uploadBytes, getBlob } from 'firebase/storage'
import { useAuthStore } from './authStore'
import { useNotfStore } from './notfStore'

interface Folder { name: string, type: string }

export const useMainStore = defineStore('main', () => {
  const storage = getStorage()
  const auth = useAuthStore()
  const notf = useNotfStore()

  const foldersCollection = ref<Folder[]>([])
  const imageCollection = ref<any>([])
  const hashCollection = ref<string[]>([])

  const curFolder = useStorage<Folder>('curFolder', { name: 'images', type: 'global' })
  const globalFoldersRef = Ref(storage, 'gallery')
  const localFoldersRef = Ref(storage, `users/${auth.email}`)

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
    const defBlob = new Blob([JSON.stringify(['#work', '#hiii'])], { type: 'application/json' })
    uploadBytes(imageDataRef, defBlob)
  }

  const createFolder = async (name: string, type: string) => {
    await getStorageRef(name, type, 'imageData')
    await getStorageRef(name, type, 'hashData')
    notf.addNotification('Папка успешно создана!')
  }

  const getDataHandler = async (hashRef: any, imageRef: any) => {
    hashCollection.value = []; imageCollection.value = []
    await getBlob(hashRef).then(async responce => {
      const data = await new Response(responce).text()
      if (data) hashCollection.value = JSON.parse(data)
    })
    await getBlob(imageRef).then(async responce => {
      const data = await new Response(responce).text()
      if (data) imageCollection.value = JSON.parse(data)
    })
  }

  const getData = async () => {
    const path: string = curFolder.value.type === 'global'
      ? `gallery/${curFolder.value.name}`
      : `users/${auth.email}/${curFolder.value.name}`
    const curHashRef = Ref(storage, `${path}/hashData.json`)
    const curImageRef = Ref(storage, `${path}/imageData.json`)
    await getDataHandler(curHashRef, curImageRef)
  }

  return {
    foldersCollection,
    curFolder,
    createFolder,
    getFolders,
    getData,
    imageCollection,
    hashCollection
  }
})
