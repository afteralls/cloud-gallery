<template>
  <div class="main">
    <div class="main__img"><img src="../assets/img/gallery-logo.webp" alt="Штрих-код"></div>
    <div class="main__text">
      <h1>Вы на главной странице Галереи</h1>
      <p>Попробуйте загрузить все изображения сразу или воспользуйтесь поиском по специальным тегам</p>
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
        height: 200px;
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

    @media (max-width: $extra-medium) {
      bottom: 150px;
      border-radius: 0;
    }
  }

  @media (max-width: $medium) {
    font-size: 0.8em;
  }

  @media (max-width: $extra-medium) {
    background-size: cover;
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
    background-color: $sColor;
    margin-left: -150px;
  }

  &::after {
    content: '';
    position: absolute;
    width: 70px;
    height: 5px;
    background-color: $sColor;
    margin-right: -150px;
  }
}
</style>
