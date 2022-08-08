<template>
  <div class="bg"></div>
  <div class="container">
    <router-view v-slot="{ Component }">
      <Transition name="route" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

<style lang="scss">
@import './assets/scss/main';

.container {
  box-sizing: border-box;
  margin: auto;
}

.bg {
  position: fixed;
  height: 100vh;
  width: 100vw;
  background: url('./assets/img/main-background.webp') center no-repeat;
  background-size: cover;
  z-index: -1;
}

.route {
  &-enter-from {
    opacity: 0;
    transform: translateX(100px);
  }
  &-enter-active {
    transition: all 0.2s ease-out;
  }
  &-leave-to {
    opacity: 0;
    transform: translateX(-100px);
  }
  &-leave-active {
    transition: all 0.2s ease-in;
  }
}
</style>
