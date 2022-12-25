import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getStorage, ref as Ref, listAll } from 'firebase/storage'
import { useAuthStore } from './authStore'

export const useMainStore = defineStore('main', () => {
  const storage = getStorage()
  const auth = useAuthStore()
  const folders = ref<string[]>([])
  const curFolder = ref('images')

  const getFolders = async (foldRef: any) => {
    const folderList = await listAll(foldRef)
    folderList.prefixes.forEach((folderRef: any) => { folders.value.push(folderRef.name) })
  }

  const foldersRef = Ref(storage, 'gallery')
  getFolders(foldersRef)
  if (auth.isAuthenticated) {
    const userRef = Ref(storage, `users/${auth.email}`)
    getFolders(userRef)
  }

  return { folders, curFolder }
})
