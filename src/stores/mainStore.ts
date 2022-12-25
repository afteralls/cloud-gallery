import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getStorage, ref as Ref, listAll, uploadBytes } from 'firebase/storage'
import { useAuthStore } from './authStore'
import { useNotfStore } from './notfStore'

export const useMainStore = defineStore('main', () => {
  const storage = getStorage()
  const auth = useAuthStore()
  const notf = useNotfStore()
  const folders = ref<string[]>([])
  const curFolder = ref('images')
  const globalfoldersRef = Ref(storage, 'gallery')

  const getFolderList = async (foldRef: any) => {
    const folderList = await listAll(foldRef)
    folderList.prefixes.forEach((folderRef: any) => { folders.value.push(folderRef.name) })
  }

  const getFolders = async () => {
    folders.value = []
    getFolderList(globalfoldersRef)
    if (auth.isAuthenticated) {
      const localfoldersRef = Ref(storage, `users/${auth.email}`)
      getFolderList(localfoldersRef)
    }
  }

  const imageDataRef = ref<any>(null)
  const createFolder = async (name: string, type: string) => {
    console.log(name, type)
    type === 'global'
      ? imageDataRef.value = Ref(storage, `gallery/${name}/imageData.json`)
      : imageDataRef.value = Ref(storage, `users/${auth.email}/${name}/imageData.json`)
    const imageBlob = new Blob([], { type: 'application/json' })
    uploadBytes(imageDataRef.value, imageBlob).then(() => notf.addNotification('Папка успешно создана!'))
  }

  return { folders, curFolder, createFolder, getFolders }
})
