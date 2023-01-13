<template>
<Teleport to="body">
  <Transition name="main">
    <div ref="viewer" v-if="isOpen && size" class="modal _center">
      <div
        @click="$emit('prev')"
        :class="{
          'arrow': true,
          'arrow-left': true,
          '_disabled': curIdx === 0,
          'active': isShow && !zoomed
        }"
      ><ArrowLeftIcon /></div>
      <div
        @click="$emit('next')"
        :class="{
          'arrow': true,
          'arrow-right': true,
          '_disabled': curIdx === size - 1,
          'active': isShow && !zoomed
        }"
      ><ArrowRightIcon /></div>
      <div :class="{ 'interface': true, 'viewer-header': true, 'active': isShow && !zoomed }">
        <small>{{ curIdx + 1 }} / {{ size }}</small>
        <div class="_row _center">
          <div v-if="auth.isAuthenticated" class="_row">
            <div
              :class="{ '_fav': true, '_fav-active': currentImage?.isFavorite }"
              @click.prevent="server.favoriteHandler(currentImage?.name as string)"
            ><HeartIcon /></div>
            <div
              class="_delete"
              @click.prevent="deleteHandler"
              :data-name="currentImage?.name"
            ><DeleteIcon /></div>
            <div
              class="_edit"
              @click.prevent="editHandler($event)"
              :data-name="currentImage?.name"
              :data-hashtags="currentImage?.hashtags"
            ><EditImageIcon /></div>
          </div>
          <Transition name="main" mode="out-in">
            <FullscreenEnterIcon v-if="!isFullscreen" @click="enter" />
            <FullscreenExitIcon v-else @click="exit" />
          </Transition>
          <CloseIcon @click="$emit('closeModal')" />
        </div>
      </div>
      <div ref="curImageContainer" class="active-image _center">
        <img ref="curImage" :src="currentImage?.src" :alt="currentImage?.name">
      </div>
      <div :class="{ 'interface': true, 'viewer-footer': true, 'active': isShow && !zoomed }">
        <h5>{{ $i18n('gallery.hashtags') }}</h5>
        <div class="_btn _hash">
          <h5>{{ currentImage?.hashtags }}</h5>
        </div>
      </div>
    </div>
  </Transition>
</Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  currentImage?: Image
  curIdx: number
  editHandler: Function
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void
  (e: 'prev'): void
  (e: 'next'): void
}>()

const server = useServerStore()
const auth = useAuthStore()
const core = useCoreStore()

const size = computed(() => core.galleryCollection.length)
const isShow = ref<boolean>(true)
const curImageContainer = ref<HTMLDivElement | null>(null)
const curImage = ref<HTMLElement | null>(null)
const viewer = ref<HTMLDivElement | null>(null)
const { isFullscreen, enter, exit } = useFullscreen(viewer)
const interval = ref<NodeJS.Timeout>()
const { direction } = useSwipe(viewer)

useEventListener(viewer, ['mousemove', 'touchstart'], () => {  
  clearTimeout(interval.value)
  isShow.value = true
  interval.value = setTimeout(() => { isShow.value = false }, 3000)
})

useEventListener(document, 'keyup', (evt: KeyboardEvent) => {  
  if (evt.code === 'ArrowLeft' && props.curIdx !== 0 && !zoomed.value) emit('prev')
  if (evt.code === 'ArrowRight' && props.curIdx !== size.value - 1 && !zoomed.value) emit('next')
  if (evt.code === 'Escape') emit('closeModal')
})

useEventListener(viewer, 'wheel', (evt: WheelEvent) => {
  evt.preventDefault()
  if (evt.deltaY < 0 && props.curIdx !== 0 && !zoomed.value) emit('prev')
  if (evt.deltaY > 0 && props.curIdx !== size.value - 1 && !zoomed.value) emit('next')
})

const zoomed = ref<boolean>(false)
const clicked = ref<boolean>(false)
let sX: number, sY: number

const zoomHandler = (evt: any) => {
  evt.preventDefault()

  evt.touches as TouchEvent
  zoomed.value = !zoomed.value
  let zoom: number = 2.5

  sX = evt.offsetX || evt.touches[0].clientX
  sY = evt.offsetY || evt.touches[0].clientY
  const img = curImage.value as HTMLElement

  evt.offsetX > 0 
    ? img.style.transition = 'all 0.5s ease'
    : img.style.transition = 'transform 0.5s ease'
  
  if (zoomed.value) {
    img.style.cursor = 'zoom-out'
    img.style.transformOrigin = `${sX}px ${sY}px`
    img.style.transform = `scale(${zoom})`
  } else {
    img.style.transformOrigin = `50% 50%`
    img.style.transform = `scale(1)`
    img.style.cursor = 'zoom-in'
  }
}

useEventListener(curImage, 'dblclick', (evt: MouseEvent) => { zoomHandler(evt) })

let counter: number = 0
useEventListener(curImage, 'touchstart', (evt: TouchEvent) => {
  counter++
  if (counter === 2)
    zoomHandler(evt)
  setTimeout(() => counter = 0, 400)
})

let xAxis: number, yAxis: number
useEventListener(curImage, ['mousedown', 'touchstart'], (evt: any) => {
  evt.preventDefault()

  clicked.value = true
  xAxis = evt.offsetX || evt.touches[0].clientX
  yAxis = evt.offsetY || evt.touches[0].clientY
  evt.target.style.cursor = 'grabbing'
})

let deltaX: number, deltaY: number
useEventListener(curImage, ['mouseup', 'touchend'], (evt: any) => {
  evt.preventDefault()

  clicked.value = false
  sX += (deltaX * -1) 
  sY += (deltaY * -1)
  evt.target.style.cursor = 'auto'
})

useEventListener(curImage, ['mousemove', 'touchmove'], (evt: any) => {
  evt.preventDefault()

  const offsetX = evt.offsetX || evt.touches[0].clientX
  const offsetY = evt.offsetY || evt.touches[0].clientY
  
  if (zoomed.value && clicked.value) {
    deltaX = (offsetX - xAxis) * 2
    deltaY = (offsetY - yAxis) * 2

    let resX = sX + (deltaX * -1)
    let resY = sY + (deltaY * -1)
    
    evt.target.style.transformOrigin = `${resX}px ${resY}px`
  }
})

watch(direction, (value) => {
  if (value === 'RIGHT' && props.curIdx !== 0 && !zoomed.value) emit('prev')
  if (value === 'LEFT' && props.curIdx !== size.value - 1 && !zoomed.value) emit('next')
  if ((value === 'UP' || value === 'DOWN') && !zoomed.value) emit('closeModal')
})

const changeActiveImage = () => {
  if (size.value >= 1) {
    switch (props.curIdx) {
      case 0: emit('next'); emit('prev'); break
      case size.value - 1: emit('prev'); break
      default: emit('next'); break
    }
  } else { emit('closeModal') }
}

const deleteHandler = async (evt: MouseEvent) => {
  await server.deleteImage((evt.target as HTMLElement).dataset.name!)
  changeActiveImage()
}
</script>

<style scoped lang="scss">
.modal {
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8;
}

.active-image {
  height: 100%;
  width: 100%;

  img {
    max-width: 100%;
    max-height: 100%;
    cursor: zoom-in;
  }
}

.interface, .arrow {
  position: fixed;
  display: flex;
  align-items: center;
  z-index: 8;
  opacity: 0;
  transition: var(--transition);
}

.interface {
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  height: 50px;
  padding: 0 var(--space);
  width: 100%;
}

.viewer-header {
  justify-content: space-between;
  gap: var(--space);
  top: 0;
}

.viewer-footer {
  justify-content: center;
  gap: 5px;
  bottom: 0;
}

.active {
  opacity: 1;
  visibility: visible !important;
}

.arrow {
  position: fixed;
  justify-content: center;
  border-radius: var(--br-rad);
  height: 80%;
  cursor: pointer;
  visibility: hidden;

  &:hover {
    background-color: var(--tp-c);
  }

  svg {
    pointer-events: none;
    height: 100px;
    width: auto;
  }

  @media(max-width: 900px) {
    width: 30%;
    opacity: 0;
  }
}

.arrow-left { left: var(--space); }
.arrow-right { right: var(--space);}
</style>
