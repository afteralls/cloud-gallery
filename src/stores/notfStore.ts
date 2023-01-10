export const useNotfStore =  defineStore('notf', () => {
  const notifications = ref<string[]>([])

  const addNotification = (notification: string) => {
    notifications.value.push(notification)
    setTimeout(() => { notifications.value.shift() }, 5000)
  }

  return { notifications, addNotification }
})
