import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ActionsData {
  foldName: string
  path: string
  desc: string
}

export const useMainStore = defineStore('main', () => {
  const actions = ref<ActionsData[]>([])
  return { actions }
})
