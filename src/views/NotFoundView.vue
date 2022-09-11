<template>
  <div class="not-found">
    <img src="../assets/img/gallery-logo.webp" alt="Not-Found">
    <div class="not-found__info _column">
      <h1>Oops... It seems you're lost</h1>
      <p>The page you were trying to find was not found</p>
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
