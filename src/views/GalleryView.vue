<template>
<div class="gallery">
  <vue-final-modal v-model="showModal" overlay-class="modal-wrapper">
    <form class="modal" @submit.prevent="updateData">
      <div class="_column" style="gap: 7.5px">
        <small>Enter common hashtags</small>
        <input
          @click.prevent.once="hash = ''"
          @focus="setUpTags"
          type="text"
          id="upHash"
          v-model="upHashtags"
          placeholder="#Mount #Art"
        >
      </div>
      <button class="_btn">
        <h3>Update</h3>
      </button>
    </form>
  </vue-final-modal>
  <app-notification/>
  <div class="mainbar">
    <div :class="['sidebar', {_invalid: prError}]">
      <form class="sidebar__form" @submit.prevent="print" :class="{'_notf-v': !prError && hash}">
        <input
          @blur="prBlur, hide = true"
          @click.prevent.once="hash = ''"
          @focus="setTags"
          type="text"
          id="hash"
          v-model="hash"
          placeholder="#Mount #Art"
        >
        <button class="_btn" @click="print">
          <font-awesome-icon icon="fa-solid fa-magnifying-glass" size="xl" />
        </button>
      </form>
      <button v-if="currentWidth > 720" class="_btn" style="width: 50px;" @click="filterHandler">
        <font-awesome-icon v-if="dateFilter" icon="fa-solid fa-filter-circle-xmark" size="lg" />
        <font-awesome-icon v-else icon="fa-solid fa-filter" size="lg" />
      </button>
      <button v-if="currentWidth > 720 && !dateFilter" class="_btn" style="width: 50px;" @click="sortHandler">
        <font-awesome-icon v-if="sortFilter" icon="fa-solid fa-arrow-up-9-1" size="lg" />
        <font-awesome-icon v-else icon="fa-solid fa-arrow-up-1-9" size="lg" />
      </button>
      <button class="_btn" @click="printAll">
        <font-awesome-icon icon="fa-solid fa-download" size="xl" />
      </button>
      <div v-if="currentWidth < 720">
        <div class="hide-set" v-if="$store.getters.isAuthenticated">
          <app-link :isUpload="true" />
          <div @click="$store.commit('logout')" class="_btn" style="max-height: 50px;">
            <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" size="lg" />
          </div>
        </div>
        <router-link v-else class="link" to="/auth">
          <font-awesome-icon icon="fa-solid fa-arrow-right-to-bracket" size="lg" />
        </router-link>
      </div>
    </div>
    <the-account v-if="currentWidth > 720"/>
  </div>
  <Transition name="route" mode="out-in">
    <the-home v-if="result.length === 0 && grouped.length === 0" />
    <div v-else>
      <div class="gallery-wrapper">
        <lightgallery
          v-if="result.length !== 0"
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
              class="lightgallery-vue__settings"
              v-if="$store.getters.isAuthenticated && currentWidth > 750"
            >
              <div
                id="edit"
                :data-name="image.name"
                :data-hash="image.hashtags"
                @contextmenu.prevent="editImage"
                class="lightgallery-vue__edit"
              >
                <font-awesome-icon icon="fa-solid fa-pen-to-square" size="lg" />
              </div>
              <div
                id="delete"
                :data-name="image.name"
                @contextmenu.prevent="delImage"
                class="lightgallery-vue__remove"
              >
                <font-awesome-icon icon="fa-solid fa-trash" size="lg" />
              </div>
            </div>
            <img :src="image.src">
          </a>
        </lightgallery>
        <div v-for="collection in grouped" :key="collection" class="sorted">
          <div class="date-info"><h3>Images uploaded for {{ collection[0].created }}</h3></div>
          <lightgallery
            :settings="{ speed: 150, plugins: plg, licenseKey: '7EC452A9-0CFD441C-BD984C7C-17C8456E' }" :onInit="onInit"
          >
            <a
              v-for="image in collection"
              :key="image.name"
              class="lightgallery-vue__item"
              :data-src="image.src"
              :data-hash="image.hashtags"
              :data-sub-html="'<h4>Hashtags: '+ image.hashtags + ' | @' + image.uploader + '</h4>'"
            >
              <div
                class="lightgallery-vue__settings"
                v-if="$store.getters.isAuthenticated && currentWidth > 750"
              >
                <div
                  id="edit"
                  :data-name="image.name"
                  :data-hash="image.hashtags"
                  @contextmenu.prevent="editImage"
                  class="lightgallery-vue__edit"
                >
                  <font-awesome-icon icon="fa-solid fa-pen-to-square" size="lg" />
                </div>
                <div
                  id="delete"
                  :data-name="image.name"
                  @contextmenu.prevent="delImage"
                  class="lightgallery-vue__remove"
                >
                  <font-awesome-icon icon="fa-solid fa-trash" size="lg" />
                </div>
              </div>
              <img :src="image.src">
            </a>
          </lightgallery>
        </div>
      </div>
      <div v-if="result.length !== 0" class="space">&nbsp;</div>
    </div>
  </Transition>
</div>
</template>

<script>
import TheHome from '../components/TheHome'
import TheAccount from '../components/TheAccount'
import Lightgallery from 'lightgallery/vue'
import AppLink from '../components/AppLink'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgFullScreen from 'lightgallery/plugins/fullscreen'
import lgZoom from 'lightgallery/plugins/zoom'
import 'lightgallery/scss/lightgallery.scss'
import AppNotification from '../components/AppNotification'
import { VueFinalModal } from 'vue-final-modal'
import {
  getStorage,
  ref as fRef,
  deleteObject,
  updateMetadata,
  uploadBytes,
  getBlob
} from 'firebase/storage'
import { ref, onBeforeMount, onMounted } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useStore } from 'vuex'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faMagnifyingGlass,
  faDownload,
  faPenToSquare,
  faTrash,
  faFilter,
  faFilterCircleXmark,
  faArrowUp91,
  faArrowUp19
} from '@fortawesome/free-solid-svg-icons'
library.add(
  faMagnifyingGlass,
  faDownload,
  faPenToSquare,
  faTrash,
  faFilter,
  faFilterCircleXmark,
  faArrowUp91,
  faArrowUp19
)

export default {
  setup () {
    const storage = getStorage()
    const store = useStore()
    const imageCollection = ref([])
    const result = ref([])
    const template = ref('')
    const tagCollection = ref([])
    const showModal = ref(false)
    const grouped = ref([])
    const dateFilter = ref(false)
    const sortFilter = ref(true)
    const imageDataRef = fRef(storage, 'core/imageData.json')
    const tagDataRef = fRef(storage, 'core/hashtags.json')
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

    const plg = ref([lgZoom, lgThumbnail, lgFullScreen])
    let lightGallery = null
    const onInit = (detail) => { lightGallery = detail.instance }

    const setTippy = () => {
      tippy('#delete', {
        content: '<div class="del">Delete (RMC)</div>',
        arrow: false,
        allowHTML: true,
        placement: 'bottom',
        delay: 300
      })
      tippy('#edit', {
        content: '<div class="del">Edit (RMC)</div>',
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
      grouped.value = []
      const currentHashs = hash.value
        .toLowerCase()
        .split(' ')
        .filter(el => el.trim())
        .join('')
        .split('#')
        .slice(1)
      imageCollection.value.forEach(el => {
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

    const printAll = async () => {
      grouped.value = []
      if (!dateFilter.value) {
        sortFilter.value
          ? imageCollection.value.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
          : imageCollection.value.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
        result.value = []
        const groupBy = (items, key) => items.reduce((result, item) => ({
          ...result,
          [item[key]]: [
            ...(result[item[key]] || []),
            item
          ]
        }), {}
        )

        grouped.value = groupBy(imageCollection.value, 'created')
        setTimeout(() => {
          console.log(grouped.value)
          initHandler()
        }, 1000)
      } else {
        result.value = []
        result.value = [...imageCollection.value]
        initHandler()
      }
    }

    const setTags = () => {
      setTippy()
      const upd = (e) => {
        if (e.target.dataset.tag && !hash.value.includes(e.target.dataset.tag)) {
          hash.value += e.target.dataset.tag + ' '
        }
      }

      setTimeout(() => {
        const tagsWrapper = document.querySelector('._tag-wrapper')
        tagsWrapper.addEventListener('click', e => { upd(e) })
        if (store.getters.isAuthenticated) {
          tagsWrapper.addEventListener('contextmenu', e => {
            e.preventDefault()
            tagCollection.value.forEach((tag, idx) => {
              if (tag === e.target.dataset.tag) {
                tagCollection.value.splice(idx, 1)
                const tagBlob = new Blob([JSON.stringify(tagCollection.value)], { type: 'application/json' })
                uploadBytes(tagDataRef, tagBlob)
                try {
                  const block = tagsWrapper
                    .querySelector(`[data-tag="${e.target.dataset.tag}"]`)
                  block.classList.add('hide')
                  setTimeout(() => {
                    tagsWrapper.removeChild(block)
                  }, 300)
                } catch (e) {}
              }
            })
          })
        }
      }, 1)
    }

    const setUpTags = () => {
      setTippy()
      const upd = (e) => {
        if (e.target.dataset.tag && !hash.value.includes(e.target.dataset.tag)) {
          upHashtags.value += e.target.dataset.tag + ' '
        }
      }

      setTimeout(() => {
        const tagsWrapper = document.querySelector('._tag-wrapper')
        tagsWrapper.addEventListener('click', e => { upd(e) })
      }, 1)
    }

    const delImage = e => {
      const { name } = e.target.dataset
      const imageRef = fRef(storage, `images/${name}`)
      const upd = async () => {
        imageCollection.value.forEach((f, i) => {
          if (f.name === name) { imageCollection.value.splice(i, 1) }
        })
      }
      upd().then(() => {
        setTimeout(() => {
          const imageDataBlob = new Blob([JSON.stringify(imageCollection.value)], { type: 'application/json' })
          uploadBytes(imageDataRef, imageDataBlob)
        }, 1000)
      })
      deleteObject(imageRef).then(async () => {
        try {
          const block = galleryWrapper
            .querySelector(`[data-name="${name}"]`)
            .closest('.lightgallery-vue__item')
          block.classList.add('hide')
          setTimeout(() => {
            result.value.forEach((f, i) => {
              if (f.name === name) { result.value.splice(i, 1) }
            })
            store.dispatch('setNotification', 'The image was successfully deleted')
            galleryWrapper.removeChild(block)
          }, 300)
        } catch (e) {}
      }).catch((e) => {
        console.log(e)
        store.dispatch('setNotification', 'Oops... Failed to delete image')
      })
    }

    const upHashtags = ref('')
    const currentName = ref('')
    const editImage = e => {
      showModal.value = true
      currentName.value = e.target.dataset.name
      upHashtags.value = e.target.dataset.hash
    }

    const updateData = () => {
      const currentTags = upHashtags.value.split(' ')
      const imageRef = fRef(storage, `images/${currentName.value}`)
      const newMetadata = {
        customMetadata: {
          hashtags: upHashtags.value
        }
      }

      updateMetadata(imageRef, newMetadata).then(() => {
        const upd = async () => {
          imageCollection.value.forEach(image => {
            if (image.name === currentName.value) { image.hashtags = upHashtags.value }
          })
        }
        upd().then(() => {
          setTimeout(() => {
            const imageDataBlob = new Blob([JSON.stringify(imageCollection.value)], { type: 'application/json' })
            uploadBytes(imageDataRef, imageDataBlob)
          }, 1000)
        })
        currentTags.forEach(tag => {
          if (!tagCollection.value.includes(tag)) {
            tagCollection.value.push(tag)
            setTimeout(() => {
              const tagBlob = new Blob([JSON.stringify(tagCollection.value)], { type: 'application/json' })
              uploadBytes(tagDataRef, tagBlob)
            }, 1000)
          }
        })
        store.dispatch('setNotification', 'Data updated successfully')
      }).catch(() => { store.dispatch('setNotification', 'Oops... Failed to update data...') })
    }

    const currentWidth = ref(0)
    const updateWidth = () => { currentWidth.value = window.innerWidth }
    window.addEventListener('resize', updateWidth)

    const getData = async () => {
      await getBlob(tagDataRef).then(async responce => {
        const data = await new Response(responce).text()
        tagCollection.value = JSON.parse(data)
      })
      getBlob(imageDataRef).then(async responce => {
        const data = await new Response(responce).text()
        imageCollection.value = JSON.parse(data)
      })
    }

    onBeforeMount(() => {
      getData().then(() => {
        tagCollection.value.forEach(el => {
          template.value += `<small class="_tag" data-tag="${el}">${el}</small>`
        })
        dateFilter.value = JSON.parse(localStorage.getItem('dateFilter')) || false
        dateFilter.value = JSON.parse(localStorage.getItem('sortFilter')) || false
        const tempRes = template.value
        localStorage.setItem('template', tempRes)
        tippy('#hash', {
          content: `<div class="_tag-wrapper">${tempRes}${store.getters.isAuthenticated && currentWidth.value > 750 ? '<small style="width: 100%; text-align: center; color: white;">Removing a tag (MRC)</small>' : ''}</div>`,
          arrow: false,
          allowHTML: true,
          interactive: true,
          trigger: 'focus'
        })
        tippy('#upHash', {
          content: `<div class="_tag-wrapper">${tempRes}</div>`,
          arrow: false,
          allowHTML: true,
          interactive: true,
          trigger: 'focus'
        })
      })
    })

    const filterHandler = () => {
      dateFilter.value = !dateFilter.value
      localStorage.setItem('dateFilter', dateFilter.value)
      if (result.value.length !== 0 || grouped.value.length !== 0) { printAll() }
    }

    const sortHandler = () => {
      sortFilter.value = !sortFilter.value
      localStorage.setItem('sortFilter', sortFilter.value)
      if (result.value.length !== 0 || grouped.value.length !== 0) { printAll() }
    }

    onMounted(async () => { updateWidth() })

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
      showModal,
      editImage,
      upHashtags,
      updateData,
      grouped,
      setUpTags,
      filterHandler,
      dateFilter,
      sortFilter,
      sortHandler
    }
  },
  components: {
    TheHome,
    Lightgallery,
    AppNotification,
    TheAccount,
    FontAwesomeIcon,
    VueFinalModal,
    AppLink
  }
}
</script>

<style lang="scss">
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

.mainbar {
  position: fixed;
  @include all-cent;
  padding: $space;
  gap: $space;
  z-index: 5;

  @media (max-width: $extra-medium) {
    bottom: 0;
    margin: 0;
    gap: 0;
    padding: 0;
    width: 100vw;
  }
}

.sidebar {
  @include glass-effect;
  @include all-cent;
  padding: $space;
  gap: $space;

  &__form {
    @include all-cent;
    gap: $space;

    @media (max-width: $extra-medium) {
      gap: $space / 2;

      input {
        width: 100%;
      }
    }
  }

  @media (max-width: $extra-medium) {
    border-radius: 0;
    width: 100%;
    gap: $space / 2;

    input {
      width: 100%;
    }
  }
}

.hide-set {
  @include all-cent;
  gap: $space / 2;

  & ._btn {
    max-height: 50px;
    padding: 0 $space;
  }
}

.gallery-wrapper {
  @include all-cent;
  flex-direction: column;
  gap: $space;
  margin: 110px 0 $space 0;

  @media (max-width: $extra-medium) {
    margin: $space 0 95px 0
  }
}

.date-info {
  @include all-cent;
  @include glass-effect;
  padding: $space;

  @media (max-width: $extra-medium) {
    font-size: 0.7em;
  }
}

.sorted {
  @include all-cent;
  width: 100%;
  gap: $space;
  flex-direction: column;

  @media (max-width: $extra-medium) {
    gap: 0;
  }
}

.lightgallery-vue {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: calc(100vw - 30px);
  gap: $space;
  flex-wrap: wrap;
  position: relative;

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

  &__settings {
    position: absolute;
    height: 30px;
    @include all-cent;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    gap: $space;
    border-radius: 0 $br-rad 0 $br-rad;
    transition: all $transition;
    opacity: 0;
    padding: 5px 10px;
    cursor: pointer;
    top: 0; right: 0;
    z-index: 3;
  }

  &__item:hover &__settings {
    opacity: 1;
  }

  &__remove, &__edit {
    @include all-cent;
    z-index: 5;
    transition: $transition;
    height: 100%;
    width: 50%;

    svg {
      z-index: 4;
      pointer-events: none;
    }
  }

  &__remove:hover {
    color: red;
  }

  &__edit:hover {
    color: orange;
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
  background-color: $mColor;
  padding: ($space / 1.5) ($space / 2);
}

.vfm__container {
  height: 100vh;
  width: 100vw;
  @include all-cent;
}

.modal {
  @include all-cent;
  @include glass-effect;
  padding: $space;
  flex-direction: column;
  gap: $space;

  input {
    width: 30vw;
  }
}
</style>
