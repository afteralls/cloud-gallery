<template>
  <div class="main">
    <div class="main__img"><img src="../assets/img/gallery-logo.webp" alt="Gallery"></div>
    <div class="main__text">
      <h1>Fast Gallery — download and enjoy!</h1>
      <p>Gallery for comfortable viewing of photos. Upload images and view them at any time. And to find the content you need faster, specify a couple of tags to search for in the future</p>
    </div>
    <div class="_row">
      <a class="link" href="https://t.me/apocalypsecore">
        <div class="_img-wrapper"><img src="../assets/img/telegram.webp" alt="Telegram"></div>
        <h3>Text me</h3>
      </a>
      <a class="link" href="https://github.com/post-apocalypse/gallery">
        <div class="_img-wrapper"><img src="../assets/img/github.webp" alt="Code"></div>
        <h3>Source</h3>
      </a>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
  props: ['res'],
  setup () {
    const currentWidth = ref(0)
    const updateWidth = () => { currentWidth.value = window.innerWidth }
    window.addEventListener('resize', updateWidth)
    onMounted(() => updateWidth())
    return { currentWidth }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/main';
.main {
  @include all-cent;
  position: relative;
  gap: $space;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-size: cover;
  &__img {
    z-index: 2;
    transform: translateY(100px);
    img {
      height: 250px;
      width: auto;
    }
    @media (max-width: $extra-medium) {
      img {
        height: 180px;
        width: auto;
      }
    }
  }
  &__text {
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: $space;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    padding: $space;
    padding-top: $space * 5;
    border-radius: $br-rad;
    max-width: 1000px;
    @media (max-width: $extra-medium) {
      bottom: 150px;
      border-radius: 0;
    }
  }
  @media (max-width: $medium) {
    font-size: 0.8em;
  }
  @media (max-width: $extra-medium) {
    & ._row {
      margin-bottom: 80px;
    }
  }
}
.br {
  text-transform: uppercase;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 4px;
  &::before {
    content: '';
    position: absolute;
    width: 70px;
    height: 5px;
    background-color: $dzColor;
    margin-left: -150px;
  }
  &::after {
    content: '';
    position: absolute;
    width: 70px;
    height: 5px;
    background-color: $dzColor;
    margin-right: -150px;
  }
}
</style>
