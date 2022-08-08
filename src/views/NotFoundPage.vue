<template>
  <div class="not-found">
    <img src="../assets/img/gallery-logo.webp" alt="Not-Found">
    <div class="not-found__info _column">
      <h1>Вы вышли за пределы Царства Эвтюмии</h1>
      <p>Всемогущий Сёгун не властвует здесь...</p>
      <app-link :isHome="true" />
    </div>
  </div>
</template>

<script>
import AppLink from '../components/AppLink.vue'

export default {
  components: { AppLink }
}
</script>

<style lang="scss">
@import '../assets/scss/main';

.not-found {
  @include all-cent;
  gap: $space;
  max-width: 700px;
  margin: $space;

  @media (max-width: $extra-medium) {
    flex-direction: column;
    text-align: center;
  }

  img {
    height: 250px;
    width: auto;
  }
}
</style>
