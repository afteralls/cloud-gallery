<template>
<div class="_wrapper">
  <section class="auth _row _tp-wp">
    <img src="@/assets/img/auth.png" alt="Auth Banner">
    <div class="_column auth-layout">
      <div class="_column">
        <h1>{{ $i18n('auth.title') }}</h1>
        <p>{{ $i18n('auth.desc') }}</p>
      </div>
      <div class="_column full">
        <div class="_row fields-wrapper full">
          <div class="auth-column">
            <small>{{ isEmailValid ? $i18n('auth.vEmail') : $i18n('auth.inEvmal') }}</small>
            <input type="email" placeholder="E-Mail" v-model="data.email">
          </div>
          <div class="auth-column">
            <small>{{ isPassValid ? $i18n('auth.vPass') : $i18n('auth.invPass') }}</small>
            <input type="password" :placeholder="$i18n('auth.plPass')" v-model="data.password">
          </div>
        </div>
        <div @click="submitHandler" :class="{ '_btn': true, '_disabled': !allValid }">
          <small>{{ $i18n('auth.login') }}</small>
        </div>
      </div>
    </div>
  </section>
</div>
</template>

<script setup lang="ts">
const router = useRouter()
const auth = useAuthStore()
const { getDataHandler } = useServerStore()
const data: ClientData = reactive({ email: '', password: '' })

const isEmailValid = computed<boolean>(() => !!validateEmail(data.email))
const isPassValid = computed<boolean>(() => !!(data.password.length && data.password !== ' '))
const allValid = computed<boolean>((() => isEmailValid.value && isPassValid.value))

const submitHandler = async () => {
  await auth.login(data)
  if (auth.isAuthenticated) {
    router.push('/')
    getDataHandler()
  }
}
</script>

<style scoped lang="scss">
.auth {
  img {
    height: 300px;
    width: auto;
    border-radius: var(--br-rad);
    object-fit: cover;
  }

  @media(max-width: 900px) {
    flex-direction: column;

    img {
      height: 250px;
      width: 100%;
    }
  }
}

.auth-layout {
  height: 100%;
  justify-content: space-around;
  gap: calc(var(--space) * 3);
}

.full {
  width: 100%;
}

.fields-wrapper {
  justify-content: space-between;

  @media(max-width: 500px) {
    flex-direction: column;

    input {
      width: 100%;
    }
  }
}

.auth-column {
  display: flex;
  flex-direction: column;
  gap: calc(var(--space) / 2);
  width: 100%;
}
</style>
