<template>
<div class="_wrapper">
  <div class="auth _row _tp-wp">
    <img src="../assets/img/auth.png" alt="Some">
    <div class="_column auth-layout">
      <div class="_column">
        <h1>Авторизация</h1>
        <p>Чтобы войти в аккаунт, пожалуйста, заполните поля ниже</p>
      </div>
      <div class="_column full">
        <div class="_row fields-wrapper full">
          <div class="auth-column">
            <small>{{ !isEmailValid ? 'Введите валидный E-Mail' : 'Введите Ваш E-Mail' }}</small>
            <input type="email" placeholder="E-Mail" v-model="data.email">
          </div>
          <div class="auth-column">
            <small>{{ !isPasswordValid ? 'Введите валидный пароль' : 'Введите Ваш пароль' }}</small>
            <input type="password" placeholder="Password" v-model="data.password">
          </div>
        </div>
        <div @click="submitHandler" :class="{ '_btn': true, '_disabled': !isAllValid }">
          <small>Войти</small>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { validateEmail } from '@/utils/validateEmail'
import type { ClientData } from '@/types'

const router = useRouter()
const auth = useAuthStore()

const data: ClientData = reactive({ email: '', password: '' })

const isEmailValid = computed<boolean>(() => !!validateEmail(data.email))
const isPasswordValid = computed<boolean>(() => !!(data.password.length && data.password !== ' '))
const isAllValid = computed<boolean>(() => isEmailValid.value && isPasswordValid.value)

const submitHandler = async () => {
  await auth.login(data)
  if (auth.isAuthenticated)
    router.push('/')
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

.full { width: 100%; }

.fields-wrapper {
  justify-content: space-between;

  @media(max-width: 500px) {
    flex-direction: column;
  
    input { width: 100% }
  }
}

.auth-column {
  display: flex;
  flex-direction: column;
  gap: calc(var(--space) / 2);
  width: 100%;
}
</style>
