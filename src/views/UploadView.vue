<template>
<div class="_layout">
  <app-notification/>
  <the-navbar/>
  <Transition name="route" mode="out-in">
    <div class="upload">
      <div class="preview">
        <div class="preview__wrapper" v-if="imagesPrewiew.length > 0 && files.length > 0">
          <div class="_row">
            <div
              @click.prevent="removeImage"
              class="preview__image-wrapper"
              v-for="img in imagesPrewiew"
              :key="img"
              v-html="img"
            ></div>
            <div class="preview__space">&nbsp;</div>
          </div>
        </div>
        <div v-else>
          <p> Окно для предпросмотра выбранных файлов, но вы их ещё не загрузили...</p>
          <br>
          <small v-if="currentWidth > 720">(Удерживайте Shift для горизонтального скролла)</small>
        </div>
      </div>
      <div class="upload__row">
        <div class="dragzone" v-bind="getRootProps()">
          <div :class="['dragzone__wrapper', { 'dragzone__wrapper-act': isDragActive }]">
            <input v-bind="getInputProps({accept: ['.jpg', '.webp', '.webp', '.jpeg']})">
            <p>{{ isDragActive ? 'Можете бросать' : 'Кликнете на область или перетащите сюда необходимые файлы' }}</p>
          </div>
        </div>
        <form class="settings" @submit.prevent="uploadHandler">
          <div :class="['_column', {_invalid: hError}]" style="justify-content: flex-end;">
            <div :class="['_notf', {'_notf-v': !hError && hashtags}]">
              <p>*&nbsp;</p><small>{{ hError || 'Введите общие хештеги'}}</small>
            </div>
            <input
              id="hash"
              type="text"
              placeholder="#EiMiko #Raiden #Yae"
              v-model="hashtags"
              @blur="hBlur"
              @click.prevent.once="hashtags = ''"
              @focus="setTags"
            >
          </div>
          <div class="_column">
            <input
              v-model="compress"
              type="checkbox"
              id="showTxt"
            ><label for="showTxt">Сжать изображения</label>
            <button :disabled="order !== 0 || isSubmitting || files.length === 0" class="_btn">
              <h3>Добавить в Коллекцию</h3>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</div>
</template>

<script>
import TheNavbar from '../components/TheNavbar'
import {
  getStorage,
  ref as fRef,
  uploadBytesResumable,
  getBlob,
  uploadBytes,
  getDownloadURL,
  getMetadata
} from 'firebase/storage'
import { useStore } from 'vuex'
import { ref, onMounted, onBeforeMount } from 'vue'
import { bytesToSize } from '../utils/bytesToSize'
import { useDropzone } from 'vue3-dropzone'
import AppNotification from '../components/AppNotification'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import Compressor from 'compressorjs'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

export default {
  components: { TheNavbar, AppNotification },
  setup () {
    const imagesPrewiew = ref([])
    const store = useStore()
    const order = ref(0)
    const files = ref([])
    const compress = ref(false)
    const storage = getStorage()
    const tagCollection = ref([])
    const imageCollection = ref([])
    const email = store.getters.email.split('@')[0]
    const { handleSubmit, isSubmitting } = useForm()
    let wrapper

    const { value: hashtags, errorMessage: hError, handleBlur: hBlur } = useField(
      'hashtags',
      yup
        .string()
        .trim()
        .required('Введите хотя бы один Хештег')
        .min(3, 'Введите не менее 3 символов')
        .matches('#', "Тег должен начинаться с '#'")
    )

    const showPreview = (filesArr) => {
      files.value = Array.from(filesArr)
      files.value.forEach(file => {
        if (!file.type.match('image')) { return }

        const reader = new FileReader()
        reader.onload = e => {
          const image = new Image()
          image.onload = function () {
            let fName = file.name
            let res = ''; let size = 0
            if (file.name.length > 6) {
              if (this.width / this.height === 1) {
                size = 3
              } else if (this.width / this.height > 1.4) {
                size = 6
              } else { size = 4 }
              fName = fName
                .split('.')
                .map((n, idx) => idx === 0 ? n.substr(0, size) + '...' + n[n.length - 1] : n)
                .join('.')
              res = `<p>${fName}</p>`
            }

            if (this.width / this.height < 1) {
              res = ''
            }

            imagesPrewiew.value.push(`
              <div class="preview__remove" data-name="${file.name}">&times;</div>
              <img src="${e.target.result}" alt="${file.name}">
              <div class="preview__info">
                ${res}
                <p>${bytesToSize(file.size)}</p>
              </div>
            `)
          }
          image.src = e.target.result
        }
        reader.readAsDataURL(file)
      })
    }

    const removeImage = e => {
      const { name } = e.target.dataset
      files.value = files.value.filter(file => file.name !== name)
      try {
        const block = wrapper.querySelector(`[data-name="${name}"]`).closest('.preview__image-wrapper')
        block.classList.add('hide')
        setTimeout(() => {
          imagesPrewiew.value = imagesPrewiew.value.filter(file => !file.match(name))
        }, 300)
      } catch (e) {}
    }

    const clearInfo = e => {
      e.style.bottom = '0'
      e.style.opacity = '1'
      e.innerHTML = '<div class="preview__progress"></div>'
    }

    const upload = (file, blocks, idx) => {
      const currentTags = hashtags.value.trim()
      const imageDataRef = fRef(storage, 'core/imageData.json')
      const tagDataRef = fRef(storage, 'core/hashtags.json')

      const metadata = {
        customMetadata: {
          hashtags: currentTags,
          uploader: email
        }
      }

      const imageRef = fRef(storage, `images/${file.name}`)
      const uploadTask = uploadBytesResumable(imageRef, file, metadata)
      uploadTask.on('state_changed', snapshot => {
        const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed()
        const block = blocks[idx].querySelector('.preview__progress')
        if (percentage > 20) { block.textContent = percentage + '%' }
        block.style.width = percentage + '%'
      }, e => { console.log(e) }, async () => {
        order.value--
        if (order.value !== 0) { store.dispatch('setNotification', 'Изображение успешно загружено') }
        imageCollection.value.push({
          name: file.name,
          hashtags: currentTags,
          src: await getDownloadURL(uploadTask.snapshot.ref),
          uploader: email,
          created: await getMetadata(uploadTask.snapshot.ref)
            .then((meta) => meta.timeCreated.split('T')[0])
        })
        files.value = files.value.filter(f => f.name !== file.name)
        imagesPrewiew.value.forEach((f, i) => {
          if (f.match(file.name)) { imagesPrewiew.value.splice(i, 1) }
        })
        if (order.value === 0) {
          hashtags.value = ''
          store.dispatch('setNotification', 'Все изображения успешно загружены')
          const imageBlob = new Blob([JSON.stringify(imageCollection.value)], { type: 'application/json' })
          uploadBytes(imageDataRef, imageBlob)
          currentTags.split(' ').forEach(tag => {
            if (!tagCollection.value.includes(tag)) { tagCollection.value.push(tag) }
          })
          const tagBlob = new Blob([JSON.stringify(tagCollection.value)], { type: 'application/json' })
          uploadBytes(tagDataRef, tagBlob)
        }
      })
    }

    const onUpload = async (filesArr, blocks) => {
      if (compress.value) {
        await filesArr.forEach((file, idx) => {
          // eslint-disable-next-line
          new Compressor(file, {
            quality: 0.6,
            success (result) { upload(result, blocks, idx) }
          })
        })
      } else {
        await filesArr.forEach((file, idx) => {
          upload(file, blocks, idx)
        })
      }
    }

    const setTags = () => {
      const upd = (e) => {
        if (e.target.dataset.tag && !hashtags.value.includes(e.target.dataset.tag)) {
          hashtags.value += e.target.dataset.tag + ' '
        }
      }

      setTimeout(() => {
        const tagsWrapper = document.querySelector('._tag-wrapper')
        tagsWrapper.addEventListener('click', e => { upd(e) })
      }, 1)
    }

    const uploadHandler = handleSubmit(() => {
      order.value = files.value.length
      document.querySelectorAll('.preview__remove').forEach(e => e.remove())
      const previewInfo = wrapper.querySelectorAll('.preview__info')
      previewInfo.forEach(clearInfo)
      onUpload(files.value, previewInfo)
    })

    const onDrop = acceptFiles => { showPreview(acceptFiles) }
    const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop })

    const getData = async () => {
      const imageRef = fRef(storage, 'core/imageData.json')
      const tagRef = fRef(storage, 'core/hashtags.json')
      await getBlob(tagRef).then(async responce => {
        const data = await new Response(responce).text()
        tagCollection.value = JSON.parse(data)
      })
      getBlob(imageRef).then(async responce => {
        const data = await new Response(responce).text()
        imageCollection.value = JSON.parse(data)
      })
    }

    onBeforeMount(() => {
      getData().then(() => {
        let template = ''
        tagCollection.value.forEach(el => {
          template += `<small class="_tag" data-tag="${el}">${el}</small>`
        })
        tippy('#hash', {
          content: `<div class="_tag-wrapper">${template}</div>`,
          arrow: false,
          allowHTML: true,
          interactive: true,
          trigger: 'focus'
        })
      })
    })

    const currentWidth = ref(0)
    const updateWidth = () => { currentWidth.value = window.innerWidth }
    window.addEventListener('resize', updateWidth)

    onMounted(() => {
      wrapper = document.querySelector('.preview')
      updateWidth()
    })

    return {
      getRootProps,
      getInputProps,
      ...rest,
      imagesPrewiew,
      removeImage,
      files,
      uploadHandler,
      hashtags,
      hError,
      hBlur,
      isSubmitting,
      compress,
      setTags,
      currentWidth,
      order
    }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/main';

input[type="checkbox"]:checked + label::after {
  content: '';
  background: url('../assets/img/check.webp') center no-repeat;
  background-size: cover;
  width: 30px;
  height: 30px;
  position: absolute;
  top: 0; left: 7px;
}

.upload {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: $space;

  &__row {
    display: flex;
    gap: $space;

    @media (max-width: $small) {
      flex-direction: column;
    }
  }
}

.preview {
  @include glass-effect;
  @include all-cent;
  text-align: center;
  padding: 0 10px 0 $space;
  height: 330px;
  width: calc(100vw - 60px);
  max-width: calc(100vw - 60px);
  overflow-x: scroll;

  @media (max-width: $small) {
    height: 250px;
  }

  &__wrapper {
    display: inline-block;
    max-width: 100%;
  }

  &__image-wrapper {
    @include all-cent;
    position: relative;
    gap: $space;

    img {
      max-height: 300px;
      background: rgba(255,255,255,0.1);
      width: auto;
      border-radius: $br-rad;
      transition: $transition;
    }

    img:hover {
      box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: $small) {
      img {
        max-height: 220px;
      }
    }
  }

  &__image-wrapper.hide {
    transform: scale(0);
    transition: transform 0.3s;
  }

  &__info {
    position: absolute;
    bottom: 0; left: 0;
    width: calc(100% - 30px);
    height: 30px;
    display: flex;
    align-items: center;
    padding: 0 $space;
    justify-content: center;
    gap: $space;
    color: white;
    text-shadow: 0 0 10px 4px rgba(0, 0, 0, 1);
    transition: $transition;
    backdrop-filter: blur(10px);
    border-radius: 0 0 $space $space;
    opacity: 0;
    overflow: hidden;
  }

  &__image-wrapper:hover &__info,
  &__image-wrapper:hover &__remove {
    opacity: 1;
  }

  &__remove {
    position: absolute;
    top: 0; right: 0;
    border-radius: 0 $space 0 $space;
    width: 30px;
    height: 30px;
    padding: 5px;
    @include all-cent;
    backdrop-filter: blur(10px);
    font-size: 30px;
    cursor: pointer;
    color: white;
    text-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition: opacity $transition;
  }

  &__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    top: 0;
    width: 100%;
    background-color: $eColor;
    transition: width $transition;
    z-index: 1;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
}

.dragzone {
  @include glass-effect;
  padding: $space;
  text-align: center;
  cursor: pointer;
  width: 500px;
  max-width: calc(100vw - 60px);

  &:hover &__wrapper {
    border: 3px dashed $mColor;
  }

  &__wrapper {
    @include all-cent;
    box-sizing: border-box;
    height: 100%;
    border-radius: $br-rad;
    border: 3px dashed $eColor;
    transition: $transition;
    padding: $space;
  }

  &__wrapper-act {
    border: 3px dashed rgba(177,136,212,1);
  }

  @media (max-width: $medium) {
    width: 250px;
  }

  @media (max-width: $small) {
    width: 100%;
  }
}

.settings {
  display: flex;
  justify-content: center;
  @include glass-effect;
  gap: $space;
  padding: $space;

  @media (max-width: $large) {
    flex-direction: column;
  }
}
</style>
