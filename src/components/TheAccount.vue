<template>
  <div class="account-wrapper">
    <div v-if="$store.getters.isAuthenticated" class="account">
      <div class="_column" style="gap: 0;">
        <small>Welcome,</small>
        <h3>{{ userName }}</h3>
      </div>
      <app-link :isUpload="true" />
      <div @click="logout" class="_btn">
        <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" size="lg" />
      </div>
    </div>
    <div v-else class="login">
      <small>Sign in to edit collection</small>
      <router-link class="link" to="/auth">
        <h3>Log in</h3>
        <font-awesome-icon icon="fa-solid fa-arrow-right-to-bracket" size="lg" />
      </router-link>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import AppLink from '../components/AppLink'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowRightToBracket,
  faArrowRightFromBracket,
  faHeart
} from '@fortawesome/free-solid-svg-icons'
library.add(faArrowRightToBracket, faArrowRightFromBracket, faHeart)

export default {
  components: { AppLink, FontAwesomeIcon },
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

.account-wrapper {
  @include all-cent;
  @include glass-effect;
  padding: $space;
}

.account {
  @include all-cent;
  gap: $space;

  & ._btn {
    height: 100%;
  }
}

.login {
  @include all-cent;
  gap: $space;
  max-width: 300px;
  text-align: right;
}

._img {
    @include all-cent;

    img {
      height: 20px;
      width: auto;
    }
  }
</style>
