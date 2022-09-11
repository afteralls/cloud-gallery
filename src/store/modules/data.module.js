import {
  getStorage,
  ref,
  deleteObject,
  updateMetadata,
  uploadBytes,
  getBlob
} from 'firebase/storage'

const storage = getStorage() // ???
const imageDataRef = ref(storage, 'core/imageData.json')
const tagDataRef = ref(storage, 'core/hashtags.json')

export default {
  state: () => ({
    imageCollection: [],
    tagCollection: [],
    favoriteCollection: [],
    template: ''
  }),
  mutations: {
    async setImageCollection (state) {
      getBlob(imageDataRef).then(async responce => {
        const data = await new Response(responce).text()
        state.imageCollection = JSON.parse(data)
      })
    },
    async setTagCollection (state) {
      getBlob(tagDataRef).then(async responce => {
        const data = await new Response(responce).text()
        state.tagCollection = JSON.parse(data)
      }).then(() => {
        state.tagCollection.forEach(el => {
          state.template += `<small class="_tag" data-tag="${el}">${el}</small>`
        })
      })
    },
    setFavoriteCollection (state, arr) {
      state.favoriteCollection = arr
    },
    updateData (state, data) {
      const { name, tags } = data
      const currentTags = data.tags.split(' ')
      const imageRef = ref(storage, `images/${name}`)
      const newMetadata = {
        customMetadata: {
          hashtags: tags
        }
      }
      updateMetadata(imageRef, newMetadata).then(() => {
        const upd = async () => {
          state.imageCollection.forEach(image => {
            if (image.name === name) { image.hashtags = tags }
          })
        }
        upd().then(() => {
          setTimeout(() => {
            const blob = new Blob([JSON.stringify(state.imageCollection)], { type: 'application/json' })
            uploadBytes(imageDataRef, blob)
          }, 1000)
        })
        currentTags.forEach(tag => {
          if (!state.tagCollection.includes(tag)) {
            state.tagCollection.push(tag)
            setTimeout(() => {
              const blob = new Blob([JSON.stringify(state.tagCollection)], { type: 'application/json' })
              uploadBytes(tagDataRef, blob)
            }, 1000)
          }
        })
        state.dispatch('setNotification', 'Данные успешно обновлены')
      }).catch(() => { state.dispatch('setNotification', 'Не получилось обновить данные...') })
    },
    deleteData (state, name) {
      const imageRef = ref(storage, `images/${name}`)

      const upd = async () => {
        state.imageCollection.forEach((f, i) => {
          if (f.name === name) { state.imageCollection.splice(i, 1) }
        })
      }

      upd().then(() => {
        setTimeout(() => {
          const blob = new Blob([JSON.stringify(state.imageCollection)], { type: 'application/json' })
          uploadBytes(imageDataRef, blob)
        }, 1000)
      })

      deleteObject(imageRef).then(async () => {
        state.dispatch('setNotification', 'Изображение успешно удалено')
      }).catch(() => { state.dispatch('setNotification', 'Уп-с... Не удалось удалить изображение') })
    }
  },
  getters: {
    getImageCollection (state) { return state.imageCollection },
    getTagCollection (state) { return state.tagCollection },
    getFavoriteCollection (state) { return state.favoriteCollection },
    getTemplate (state) { return state.template }
  },
  actions: {
    setImageCollection ({ commit }) {
      commit('setImageCollection')
    },
    setTagCollection ({ commit }) {
      commit('setTagCollection')
    },
    setFavoriteCollection ({ commit }) {
      commit('setFavoriteCollection')
    },
    updateData ({ commit }, data) {
      commit('updateData', data)
    },
    deleteImage ({ commit }, name) {
      commit('deleteData', name)
    }
  }
}
