<template>
  <div v-if="$store.getters.getErrorMessage" class="notification">
    <img src="../assets/img/notf.webp" alt="Error">
    <div class="notification__text"><h3>{{ $store.getters.getErrorMessage }}</h3></div>
  </div>
  <div v-if="$store.getters.getMessage" class="notification">
    <img src="../assets/img/notf.webp" alt="Error">
    <div class="notification__text"><h3>{{ $store.getters.getMessage }}</h3></div>
  </div>
</template>

<style lang="scss">
@import '../assets/scss/main';

.notification {
  display: flex;
  align-items: center;
  text-align: center;
  position: absolute;
  top: $space;
  margin: $space;
  z-index: 5;

  &__text {
    @include glass-effect;
    padding: $space;
  }

  img {
    max-width: 50px;
    padding: $space;
  }
}
</style>
