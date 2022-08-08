<template>
  <div class="navbar">
    <app-link :isHome="true" />
    <div v-if="$store.getters.isAuthenticated" class="navbar__account">
      <h3>{{ userName }}</h3>
      <h3>|</h3>
      <div class="_img-wrapper">
        <img @click.prevent="logout" src="../assets/img/exit.webp" alt="Выйти">
      </div>
    </div>
  </div>
</template>

<script>
import AppLink from './AppLink'
import { useStore } from 'vuex'

export default {
  components: { AppLink },
  setup () {
    const store = useStore()
    const userName = store.getters.email
      ? store.getters.email.split('@')[0]
      : 'default'

    const logout = () => {
      store.commit('logout')
    }

    return { logout, userName }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/main';

.navbar {
  display: flex;
  gap: $space;

  &__account {
    @include glass-effect;
    @include all-cent;
    gap: $space;
    padding: $space;
    background: linear-gradient(90deg, rgba(62,80,130, 0.7) 10%, rgba(255,255,255,0.2) 100%);

    img {
      max-height: 20px;
      cursor: pointer;
      width: auto;
      transition: $transition;
    }

    img:hover {
      transform: scale(1.1);
    }
  }

  @media (max-width: $extra-small) {
    flex-direction: column;
    width: 100%;
  }
}
</style>
