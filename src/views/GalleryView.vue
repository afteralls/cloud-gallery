<template>
  <div class="gallery">
    <app-notification/>
    <div :class="['sidebar', {_invalid: prError}]">
      <form class="sidebar__form" @submit.prevent="print" :class="{'_notf-v': !prError && hash}">
        <input
          @blur="prBlur, hide = true"
          @click.prevent.once="hash = ''"
          @focus="setTags"
          type="text"
          id="hash"
          v-model="hash"
          :placeholder="currentWidth > 600 ? '#Mount #Art' : '#Art #Sun'"
        >
        <button class="_btn" @click="print">
          <div class="_img-wrapper"><img src="../assets/img/search.webp" alt="Search"></div>
          <h3 v-if="currentWidth > 750">Search</h3>
        </button>
        <h3>|</h3>
      </form>
      <button class="_btn" @click="printAll">
        <div class="_img-wrapper"><img src="../assets/img/download.webp" alt="Dowload"></div>
        <h3 v-if="currentWidth > 750">Download all</h3>
      </button>
      <h3 v-if="currentWidth > 750">|</h3>
      <app-link :isUpload="true" :currentWidth="currentWidth" />
    </div>
    <Transition name="route" mode="out-in">
      <the-home v-if="result.length === 0 && hide" />
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
        >
          <div
            @contextmenu.prevent="delImage"
            class="lightgallery-vue__remove"
            :data-name="image.name"
            v-if="$store.getters.isAuthenticated && currentWidth > 750"
          >&times;</div>
          <img :src="image.src">
        </a>
      </lightgallery>
    </Transition>
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
import AppNotification from '../components/AppNotification'
import { getStorage, ref as fRef, listAll, getDownloadURL, deleteObject } from 'firebase/storage'
import { ref, onBeforeMount, onMounted } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import { useStore } from 'vuex'

export default {
  components: { TheHome, AppLink, Lightgallery, AppNotification },
  setup () {
    const storage = getStorage()
    const store = useStore()
    const collection = ref([])
    const result = ref([])
    const hashs = ref([])
    const hide = ref(true)
    const template = ref('')
    const { handleSubmit } = useForm()
    let galleryWrapper = null
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
      const result = await listAll(listRef)
      let allHts = ''
      result.items.forEach(async el => {
        const hts = el.name
          .split('--')[0]
          .toString()
          .split('#')
          .slice(1)
          .map(h => '#' + h.trim())
          .join(' ')
        allHts += hts + ' '
        const uploader = el.name
          .split('--')[1]
          .toString()
        collection.value.push({
          name: el.name,
          src: await getDownloadURL(el),
          hashtags: hts,
          uploader
        })
      })
      const ress = allHts.split(' ')
      hashs.value = new Set(ress.slice(0, ress.length - 1))
    }

    const setTippy = () => {
      tippy('.lightgallery-vue__remove', {
        content: '<div class="del">Delete (MRC)</div>',
        arrow: false,
        allowHTML: true,
        placement: 'bottom',
        delay: 300
      })
    }

    const initHandler = () => {
      setTimeout(() => {
        lightGallery.refresh()
        galleryWrapper = document.querySelector('.lightgallery-vue')
        setTippy()
      }, 1000)
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
        setTimeout(() => {
          if (result.value.length === 0) {
            store.dispatch('setNotification', 'No matches found, try searching differently')
          }
        }, 1)
      })

      hash.value = ''
      initHandler()
    })

    const printAll = () => {
      result.value = []
      result.value = [...collection.value]
      initHandler()
    }

    const setTags = () => {
      const upd = (e) => {
        if (e.target.dataset.tag && !hash.value.includes(e.target.dataset.tag)) {
          hash.value += e.target.dataset.tag + ' '
        }
      }

      if (currentWidth.value < 720) {
        hide.value = false
      }

      setTimeout(() => {
        const tagsWrapper = document.querySelector('._tag-wrapper')
        tagsWrapper.addEventListener('click', e => { upd(e) })
      }, 1)
    }

    const delImage = e => {
      const { name } = e.target.dataset
      const desertRef = fRef(storage, `images/${name}`)
      deleteObject(desertRef).then(() => {
        store.dispatch('setNotification', 'The image was successfully deleted')
      }).catch(() => {
        store.dispatch('setNotification', 'Oops... Failed to delete image')
      })
      try {
        const block = galleryWrapper
          .querySelector(`[data-name="${name}"]`)
          .closest('.lightgallery-vue__item')
        block.classList.add('hide')
        setTimeout(() => {
          result.value.forEach((f, i) => {
            if (f.name === name) { result.value.splice(i, 1) }
          })
          collection.value.forEach((f, i) => {
            if (f.name === name) { collection.value.splice(i, 1) }
          })
          galleryWrapper.removeChild(block)
        }, 300)
      } catch (e) {}
    }

    const currentWidth = ref(0)
    const updateWidth = () => { currentWidth.value = window.innerWidth }
    window.addEventListener('resize', updateWidth)

    onBeforeMount(async () => {
      await getImages()

      hashs.value.forEach(el => {
        template.value += `<small class="_tag" data-tag="${el}">${el}</small>`
      })
      const tempRes = template.value
      localStorage.setItem('template', tempRes)

      tippy('#hash', {
        content: `<div class="_tag-wrapper">${tempRes}</div>`,
        arrow: false,
        allowHTML: true,
        interactive: true,
        trigger: 'focus'
      })
    })

    onMounted(() => { updateWidth() })

    return {
      result,
      print,
      onInit,
      plg,
      hash,
      printAll,
      prBlur,
      prError,
      currentWidth,
      setTags,
      delImage,
      hide
    }
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
  justify-content: center;
  width: calc(100% - 30px);
  gap: $space;
  flex-wrap: wrap;
  margin-top: 110px;

  &__item {
    @include all-cent;
    position: relative;
  }

  &__item.hide {
    transform: scale(0);
    transition: transform 0.3s;
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
    transition: all $transition;
  }

  &__item:hover &__remove {
    opacity: 1;
  }

  &__remove:hover {
    color: red;
  }

  @media (max-width: $extra-medium) {
    margin-top: $space;
      gap: 5px;

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

.del {
  background-color: $sColor;
  padding: ($space / 1.5) ($space / 2);
}
</style>
