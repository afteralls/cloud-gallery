<template>
  <router-link v-if="isHome" class="link" to="/">
    <div class="_img-wrapper"><img src="../assets/img/arrow-left.webp" alt="To Home"></div>
    <h3>Вернуться в Галерею</h3>
  </router-link>
  <router-link v-if="isUpload" class="link" to="/upload">
    <div class="_img-wrapper"><img src="../assets/img/add.webp" alt="Add"></div>
    <h3 v-if="currentWidth > 900">Пополнить коллекцию</h3>
  </router-link>
</template>

<script>
export default {
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

  h3 {
    padding-right: $space;
  }

  &:hover {
    box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.2);
    background: rgba(255,255,255,0.3);
  }

  img {
    margin: $space;
    max-height: 20px;
    width: auto;
  }
}
</style>
