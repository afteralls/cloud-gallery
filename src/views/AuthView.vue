<template>
<div class="_wrapper">
  <div class="auth _row _tp-bg">
    <img src="../assets/img/auth.png" alt="Some">
    <div class="_column auth-layout">
      <div class="_column">
        <h1>Авторизация</h1>
        <p>Чтобы войти в аккаунт, пожалуйста, заполните поля ниже</p>
      </div>
      <div class="_column">
        <div class="_row">
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

interface ClientData { email: string, password: string }

const router = useRouter()
const auth = useAuthStore()

const data: ClientData = reactive({ email: '', password: '' })

const isEmailValid = computed<boolean>(() => !!validateEmail(data.email))
const isPasswordValid = computed<boolean>(() => !!(data.password.length && data.password !== ' '))
const isAllValid = computed<boolean>(() => isEmailValid.value && isPasswordValid.value)

const submitHandler = async () => {
  await auth.login(data)
  if (auth.isAuthenticated) router.push('/')
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
}

.auth-layout {
  height: 100%;
  justify-content: space-around;
  gap: calc(var(--space) * 3);

  & ._btn { width: 100%; }
}

.auth-column {
  display: flex;
  flex-direction: column;
  gap: calc(var(--space) / 2);
}
</style>
