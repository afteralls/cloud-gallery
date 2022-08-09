<template>
<Transition name="route" mode="out-in">
  <div v-if="$store.getters.getErrorMessage" class="notification">
    <div class="notification__text"><h3>{{ $store.getters.getErrorMessage }}</h3></div>
  </div>
</Transition>
<Transition name="route" mode="out-in">
  <div v-if="$store.getters.getMessage" class="notification">
    <div class="notification__text"><h3>{{ $store.getters.getMessage }}</h3></div>
  </div>
</Transition>
</template>

<style lang="scss">
@import '../assets/scss/main';

.notification {
  display: flex;
  align-items: center;
  text-align: center;
  position: absolute;
  top: 110px;
  margin: $space;
  z-index: 10;

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
