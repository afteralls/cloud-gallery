<template>
  <div class="navbar">
    <app-link :isHome="true" />
    <a v-if="!$store.getters.isAuthenticated" class="link" href="https://t.me/apocalypsecore">
      <div class="_img-wrapper"><img src="../assets/img/telegram.webp" alt="To Home"></div>
      <h3>Попросить Омамори</h3>
    </a>
    <div v-else class="navbar__account">
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
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { inject } from 'vue'

export default {
  components: { AppLink },
  setup () {
    const store = useStore()
    const router = useRouter()
    const email = inject('email')
    const userName = store.getters.email
      ? store.getters.email.split('@')[0]
      : email.split('@')[0]

    const logout = () => {
      store.commit('logout')
      router.push('/')
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
    background: linear-gradient(90deg, rgba(96,69,164,0.7) 10%, rgba(255,255,255,0.2) 100%);

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
