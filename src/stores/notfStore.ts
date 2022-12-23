import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotfStore = defineStore('notf', () => {
  const notifications = ref<string[]>([])

  const addNotification = (notification: string) => {
    notifications.value.push(notification)
    setTimeout(() => {
      notifications.value.shift()
    }, 5000)
  }

  setTimeout(() => {
    addNotification('Такой логин не найден')
  }, 3000)
  setTimeout(() => {
    addNotification('Пароль введён не верно')
  }, 1000)
  setTimeout(() => {
    addNotification('Изображение успешно загружено')
  }, 2000)
  setTimeout(() => {
    addNotification('Все изображения загружены')
  }, 4000)

  return { notifications, addNotification }
})
