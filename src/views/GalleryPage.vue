<template>
  <div class="gallery">
    <div :class="['sidebar', {_invalid: prError}]">
      <form class="sidebar__form" @submit.prevent="print" :class="{'_notf-v': !prError && hash}">
        <input
          @blur="prBlur"
          type="text"
          v-model="hash"
          :placeholder="currentWidth > 500 ? '#EiMiko #Raiden #Yae' : '#Ei #Miko'"
        >
        <button class="_btn" @click="print">
          <div class="_img-wrapper"><img src="../assets/img/search.webp" alt="Search"></div>
          <h3 v-if="currentWidth > 750">Поиск</h3>
        </button>
        <h3>|</h3>
      </form>
      <button class="_btn" @click="printAll">
        <div class="_img-wrapper"><img src="../assets/img/download.webp" alt="Search"></div>
        <h3 v-if="currentWidth > 750">Загрузить всё</h3>
      </button>
      <h3 v-if="currentWidth > 500">|</h3>
      <app-link :isUpload="true" :currentWidth="currentWidth" />
    </div>
    <the-home v-if="result.length === 0" />
    <lightgallery
      v-else
      :settings="{ speed: 150, plugins: plg, licenseKey: '7EC452A9-0CFD441C-BD984C7C-17C8456E' }" :onInit="onInit"
    >
      <a
        v-for="image in result"
        :key="image.name"
        class="lightgallery-vue__item"
        :data-src="image.src"
        :data-hash="image.hashtags"
        :data-sub-html="'<h4>Hashtags: '+ image.hashtags + ' | @' + image.uploader + '</h4>'"
      ><img :src="image.src"></a>
    </lightgallery>
    <div v-if="result.length !== 0" class="space">&nbsp;</div>
  </div>
</template>

<script>
import TheHome from '../components/TheHome'
import AppLink from '../components/AppLink'
import Lightgallery from 'lightgallery/vue'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgFullScreen from 'lightgallery/plugins/fullscreen'
import lgZoom from 'lightgallery/plugins/zoom'
import 'lightgallery/scss/lightgallery.scss'
import { getStorage, ref as fRef, listAll, getDownloadURL } from 'firebase/storage'
import { ref, onMounted } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

export default {
  components: { TheHome, AppLink, Lightgallery },
  setup () {
    const storage = getStorage()
    const collection = ref([])
    const result = ref([])
    const { handleSubmit } = useForm()
    const { value: hash, errorMessage: prError, handleBlur: prBlur } = useField(
      'hash',
      yup
        .string()
        .trim()
        .required()
        .min(3)
    )
    const listRef = fRef(storage, 'images')
    const plg = ref([lgZoom, lgThumbnail, lgFullScreen])
    let lightGallery = null

    const onInit = (detail) => { lightGallery = detail.instance }

    const getImages = async () => {
      const res = await listAll(listRef)
      res.items.forEach(async el => {
        const res = el.name
          .split('--')[0]
          .toString()
          .split('#')
          .slice(1)
          .map(h => '#' + h.trim())
          .join(' ')
        const uploader = el.name
          .split('--')[1]
          .toString()
        collection.value.push({
          name: el.name,
          src: await getDownloadURL(el),
          hashtags: res,
          uploader
        })
      })
    }

    const print = handleSubmit(() => {
      result.value = []
      const currentHashs = hash.value
        .toLowerCase()
        .split(' ')
        .filter(el => el.trim())
        .join('')
        .split('#')
        .slice(1)
      collection.value.forEach(el => {
        const allHashs = el.hashtags.split('#').map(el => el.trim()).slice(1)
        if (currentHashs.length > 1) {
          const arr = [allHashs, currentHashs]
          const res = arr.reduce((p, c) => p.filter(e => c.includes(e)))
          if (res.length === currentHashs.length) { result.value.push(el) }
        } else if (currentHashs.length === 1) {
          if (allHashs.includes(currentHashs[0])) { result.value.push(el) }
        }
      })

      setTimeout(() => {
        lightGallery.refresh()
      }, 1000)
    })

    const printAll = () => {
      result.value = []
      result.value = [...collection.value]
      setTimeout(() => {
        lightGallery.refresh()
      }, 1000)
    }

    const currentWidth = ref(0)
    const updateWidth = () => { currentWidth.value = window.innerWidth }
    window.addEventListener('resize', updateWidth)
    onMounted(() => { getImages(); updateWidth() })

    return { result, print, onInit, plg, hash, printAll, prBlur, prError, currentWidth }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/main';
@import '../assets/scss/main';
@import 'lightgallery/scss/lg-zoom';
@import 'lightgallery/scss/lg-fullscreen';
@import 'lightgallery/scss/lg-thumbnail';

.gallery {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space;
  height: 100vh;
  width: 100vw;
}

.sidebar {
  @include glass-effect;
  margin: $space;
  position: fixed;
  @include all-cent;
  padding: $space;
  gap: $space;
  z-index: 5;

  &__form {
    @include all-cent;
    gap: $space;
  }

  @media (max-width: $extra-medium) {
    bottom: 0;
    margin: 0;
    border-radius: 0;
    width: 100%;

    input {
      width: 100px;
    }
  }
}

.lightgallery-vue {
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  width: calc(100% - 30px);
  gap: 5px;
  flex-wrap: wrap;
  margin-top: 110px;

  &__item {
    @include all-cent;
  }

  img {
    height: 150px;
    width: 150px;
    object-fit: cover;
    border-radius: $br-rad;
    transition: $transition;
  }

  img:hover {
    box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: $extra-medium) {
    margin-top: $space;

    img {
      height: 80px;
      width: 80px;
    }
  }
}

.space {
  display: block;
  min-height: $space;
  width: 100%;

  @media (max-width: $extra-medium) {
    min-height: 95px;
    width: 100%;
  }
}
</style>
