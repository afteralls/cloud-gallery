<template>
  <div class="layout">
    <the-navbar />
    <Transition name="route" mode="out-in">
      <the-auth v-if="!$store.getters.isAuthenticated" />
      <the-upload v-else />
    </Transition>
  </div>
</template>

<script>
import TheAuth from '../components/TheAuth'
import TheUpload from '../components/TheUpload'
import TheNavbar from '../components/TheNavbar'

export default {
  components: { TheAuth, TheUpload, TheNavbar }
}
</script>

<style lang="scss">
@import '../assets/scss/main';

.layout {
  @include all-cent;
  flex-direction: column;
  gap: $space;
  margin: $space;
}
</style>
