<template>
  <div class="main">
    <div class="main__text">
      <h1>Добро пожаловать в Царство Эвтюмии</h1>
      <p>Самая потрясающая галерея искусства из ныне существующих</p>
      <div class="br">
        <img v-for="count in 3" :key="count" src="../assets/img/electro.webp" alt="Electro">
      </div>
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
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: url('../assets/img/main.webp') center no-repeat;
  background-size: cover;

  &__text {
    display: flex;
    flex-direction: column;
    text-align: center;
    position: absolute;
    gap: $space;
    bottom: $space;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    padding: $space;

    h1 {
      padding: 0 ($space * 2);
    }

    -webkit-mask: linear-gradient(
      to right,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.8) 5%,
      rgba(0, 0, 0, 1) 7%,
      rgba(0, 0, 0, 1) 93%,
      rgba(0, 0, 0, 0.8) 95%,
      rgba(0, 0, 0, 0) 100%
    );

    @media (max-width: $extra-medium) {
      bottom: 150px;
    }
  }

  @media (max-width: $medium) {
    font-size: 0.8em;
  }

  @media (max-width: $extra-medium) {
    background: url('../assets/img/main-mob.webp') center no-repeat;
    background-size: cover;
  }
}

.br {
  @include all-cent;
  position: relative;
  gap: $space;

  img {
    max-width: 50px;
    height: auto;
  }

  &::before {
    content: '';
    position: absolute;
    width: 70px;
    height: 5px;
    background-color: $eColor;
    margin-left: -270px;

    @media (max-width: $extra-medium) {
      margin-left: -240px;
    }
  }

  &::after {
    content: '';
    position: absolute;
    width: 70px;
    height: 5px;
    background-color: $eColor;
    margin-right: -270px;

    @media (max-width: $extra-medium) {
      margin-right: -240px;
    }
  }

  @media (max-width: $extra-medium) {
    img {
      max-width: 40px;
    }
  }
}
</style>
