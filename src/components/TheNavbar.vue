<template>
  <div class="navbar">
    <app-link :isHome="true" />
  </div>
</template>

<script>
import AppLink from './AppLink'

export default {
  components: { AppLink }
}
</script>

<style lang="scss">
@import '../assets/scss/main';

.navbar {
  display: flex;
  gap: $space;

  @media (max-width: $extra-small) {
    flex-direction: column;
    width: 100%;
  }
}
</style>
