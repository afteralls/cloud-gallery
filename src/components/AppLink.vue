<template>
  <router-link v-if="isHome" class="link" to="/">
    <font-awesome-icon icon="fa-solid fa-arrow-left" size="lg" />
    <h3>Вернуться в Галерею</h3>
  </router-link>
  <router-link v-if="isUpload" class="link" to="/upload">
    <font-awesome-icon icon="fa-solid fa-plus" size="lg" />
  </router-link>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
library.add(faArrowLeft, faPlus)

export default {
  components: { FontAwesomeIcon },
  props: ['isHome', 'isUpload', 'currentWidth']
}
</script>

<style lang="scss">
@import '../assets/scss/main';

.link {
  @include all-cent;
  text-decoration: none;
  text-align: center;
  color: black;
  @include glass-effect;
  transition: $transition;
  gap: $space / 2;
  padding: 0 $space;
  height: 50px;

  &:hover {
    box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.2);
    background: rgba(255,255,255,0.3);
  }

  img {
    max-height: 20px;
    width: auto;
  }
}
</style>
