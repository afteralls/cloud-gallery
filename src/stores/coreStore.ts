export const useCoreStore = defineStore('core', () => {
  const notf = useNotfStore()
  const i18n = inject('func') as LangFunc

  const foldersCollection = ref<Folder[]>([])
  const imageCollection = ref<Image[]>([])
  const hashtagsCollection = ref<string[]>([])
  const favImageCollection = ref<Image[]>([])
  const favHashtagsCollection = ref<string[]>([])
  const galleryCollection = ref<Image[]>([])

  const clientImages = ref<File[] | null | undefined>([])
  const previewImages = ref<PreviewInfo[]>([])

  const curFilter = ref<string>('date')
  const curFolder = useStorage<Folder>('curFolder', { name: 'images', type: 'global' })

  const dateCollection = ref<string[]>(['No Data'])
  const uploaders = ref<string[]>(['No Data'])
  const curDate = ref<string>(dateCollection.value[0])
  const curUploader = ref<string>(uploaders.value[0])

  const search = (modal: string) => {
    galleryCollection.value = []
    const currentTagsCollection: string[] = getValidTagsCollection(modal)

    currentTagsCollection.forEach((tag, idx) => {
      if(!tag) currentTagsCollection.splice(idx, 1)
    })

    imageCollection.value.forEach(image => {
      const imageHashtagsCollection: string[] = getValidTagsCollection(image.hashtags)

      if (currentTagsCollection.length > 1) {
        const allTags = [imageHashtagsCollection, currentTagsCollection]
        const deepValidate = allTags.reduce((p, c) => p.filter(e => c.includes(e)))

        if (deepValidate.length === currentTagsCollection.length)
          galleryCollection.value.push(image)
      } else if (currentTagsCollection.length === 1) {
        if (imageHashtagsCollection.includes(currentTagsCollection[0]))
          galleryCollection.value.push(image)
      }
    })

    if (!galleryCollection.value.length)
      notf.addNotification(i18n('notf.noMatches'))
  }

  const deepSearch = () => {
    galleryCollection.value = []
    if (curFilter.value === 'date') {
      imageCollection.value.forEach(image => {
        if (curDate.value === image.created)
          galleryCollection.value.push(image)
      })
    } else if (curFilter.value === 'user') {
      imageCollection.value.forEach(image => {
        if (curUploader.value === image.uploader)
          galleryCollection.value.push(image)
      })
    }
    if (!galleryCollection.value.length)
      notf.addNotification(i18n('notf.noMatches'))
  }

  return {
    foldersCollection,
    curFolder,
    imageCollection,
    hashtagsCollection,
    clientImages,
    previewImages,
    galleryCollection,
    favImageCollection,
    favHashtagsCollection,
    curDate,
    dateCollection,
    curUploader,
    uploaders,
    curFilter,
    search,
    deepSearch
  }
})
