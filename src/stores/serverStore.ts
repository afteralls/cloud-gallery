import type { StorageReference } from 'firebase/storage'
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

  const uploadBytesHandler = async (ref: StorageReference, array: Image[] | string[] | []) => {
    const blob = new Blob([JSON.stringify(array)], { type: 'application/json' })
    await uploadBytes(ref, blob)
  }

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

  const getStorageRefAndUpload = async (data: RefAndUpl) => {
    const dataRef = data.folderType === 'global'
      ? Ref(storage, `gallery/${data.folderName}/${data.fileName}.json`)
      : Ref(storage, `users/${auth.email}/${data.folderName}/${data.fileName}.json`)
    uploadBytesHandler(dataRef, data.collection)
  }

  const createFolder = async (name: string, type: string) => {
    await getStorageRefAndUpload({
      folderName: name,
      folderType: type,
      fileName: 'imageData',
      collection: []
    })
    await getStorageRefAndUpload({
      folderName: name,
      folderType: type,
      fileName: 'hashData',
      collection: []
    })
    notf.addNotification('Папка успешно создана!')
  }

  const getFavData = async () => {
    const favHashRef = Ref(storage, `users/${auth.email}/favorites/hashData.json`)
    const favImageRef = Ref(storage, `users/${auth.email}/favorites/imageData.json`)
    core.favHashtagsCollection = []; core.favImageCollection = []

    await getBlob(favHashRef).then(async responce => {
      const data = await new Response(responce).text()
      if (data) core.favHashtagsCollection = JSON.parse(data)
    })

    await getBlob(favImageRef).then(async responce => {
      const data = await new Response(responce).text()
      if (data) core.favImageCollection = JSON.parse(data)
    })
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

  const interval = ref<NodeJS.Timeout>()
  const isUploading = ref<boolean>(false)

  const syncDataHandler = async (tags: string) => {
    clearTimeout(interval.value)
    await uploadBytesHandler(imageDataRef.value as StorageReference, core.imageCollection)
    const curCollectionLength: number = core.hashtagsCollection.length

    tags.split(' ').forEach((tag: string) => {
      if (!core.hashtagsCollection.includes(tag))
        core.hashtagsCollection.push(tag)
    })

    if (curCollectionLength !== core.hashtagsCollection.length)
      await uploadBytesHandler(hashDataRef.value as StorageReference, core.hashtagsCollection)
    notf.addNotification('Данные успешно синхронизированы')
  }

  const uploadImages = (file: File, blocks: NodeListOf<Element>, idx: number, tags: string) => {
    const currentTags: string = tags.trim()

    let exist: boolean = false
    core.imageCollection.forEach(image => {
      if (file.name === image.name)
        exist = true
    })

    const metadata = {
      customMetadata: {
        hashtags: currentTags,
        uploader: auth.email
      }
    }

    const imageRef = Ref(storage, `${curPath.value}/${exist ? 'new-' : ''}${file.name}`)
    const uploadTask = uploadBytesResumable(imageRef, file, metadata)

    uploadTask.on('state_changed', snapshot => {
      const percentage = parseInt(((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed())
      const block: any = blocks[idx]
      if (percentage > 30) { block.textContent = percentage + '%' }
      block.style.width = percentage + '%'
    }, () => {}, async () => {
      notf.addNotification('Изображение успешно загружено')
      clearTimeout(interval.value)
      interval.value = setTimeout(() => { syncDataHandler(currentTags) }, 5000)

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
        syncDataHandler(currentTags)
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

  const deleteImage = async (name: string) => {
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

  const favAddHandler = (image: Image) => {
    core.favImageCollection.push(image)
    core.favImageCollection.forEach(image => {
      image.hashtags.split(' ').forEach((tag: string) => {
        if (!core.favHashtagsCollection.includes(tag))
          core.favHashtagsCollection.push(tag)
      })
    })
  }

  const favDeleteHandler = (imageName: string) => {
    core.favImageCollection.forEach((image, idx) => {
      if (image.name === imageName)
        core.favImageCollection.splice(idx, 1)
    })
  }

  const favoriteHandler = async (name: string) => {
    const oldLength = core.favHashtagsCollection.length
    core.galleryCollection.forEach(image => {
      if (image.name === name) {
        image.isFavorite = !image.isFavorite
        image.isFavorite
          ? favAddHandler(image)
          : favDeleteHandler(image.name)
      }
    })

    await getStorageRefAndUpload({
      folderName: 'favorites',
      folderType: 'local',
      fileName: 'imageData',
      collection: core.favImageCollection
    })

    if (oldLength !== core.favHashtagsCollection.length) {
      await getStorageRefAndUpload({
        folderName: 'favorites',
        folderType: 'local',
        fileName: 'hashData',
        collection: core.favHashtagsCollection
      })
    }

    notf.addNotification('Данные успешно обновлены!')
  }

  const getDataHandler = async () => {
    await getFolders()
    await getData()

    if (auth.isAuthenticated) {
      await getFavData()
      core.imageCollection.forEach((image, idx) => {
        core.favImageCollection.forEach(favImage => {
          if(image.name === favImage.name)
          core.imageCollection[idx].isFavorite = true
        })
      })
    }
  }

  return {
    createFolder,
    getDataHandler,
    getData,
    uploadHandler,
    deleteImage,
    updateImageData,
    isUploading,
    deleteTag,
    favoriteHandler
  }
})
