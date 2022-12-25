import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { getStorage, ref as Ref, listAll, uploadBytes, getBlob } from 'firebase/storage'
import { useAuthStore } from './authStore'
import { useNotfStore } from './notfStore'

export const useMainStore = defineStore('main', () => {
  const storage = getStorage()
  const auth = useAuthStore()
  const notf = useNotfStore()
  const folders = ref<any>([])
  const curFolder = useStorage<{ name?: string, type?: string }>('curFolder', { name: 'images', type: 'global' })
  const imageCollection = ref([])
  const hashCollection = ref<string[]>([])
  const globalfoldersRef = Ref(storage, 'gallery')

  const getFolderList = async (foldRef: any, type: string) => {
    const folderList = await listAll(foldRef)
    folderList.prefixes.forEach((folderRef: any) => {
      folders.value.push({ name: folderRef.name, type })
    })
  }

  const getFolders = async () => {
    folders.value = []
    await getFolderList(globalfoldersRef, 'global')
    if (auth.isAuthenticated) {
      const localfoldersRef = Ref(storage, `users/${auth.email}`)
      await getFolderList(localfoldersRef, 'local')
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

  const isGlobal = computed(() => curFolder.value.type === 'global')
  const getData = async () => {
    const path: string = isGlobal.value
      ? `gallery/${curFolder.value.name}`
      : `users/${auth.email}/${curFolder.value.name}`
    const curHashRef = Ref(storage, `${path}/hashData.json`)
    const curImageRef = Ref(storage, `${path}/imageData.json`)
    await getDataHandler(curHashRef, curImageRef)
  }

  return {
    folders,
    curFolder,
    createFolder,
    getFolders,
    getData,
    imageCollection,
    hashCollection
  }
})
