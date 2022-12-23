<template>
  <div class="_wrapper">
    <form class="auth" @submit.prevent="onSubmit">
      <img src="../assets/img/auth.webp" alt="">
      <div class="auth__column">
        <div class="_column">
          <h1>Авторизация</h1>
          <p>Чтобы войти в аккаунт, пожалуйста, заполните поля ниже</p>
        </div>
        <div class="_column">
          <div class="_row">
            <div :class="['_column', {_invalid: eError}]">
              <div :class="['_notf', {'_notf-v': !eError && email}]">
                <p>*&nbsp;</p><small>{{ eError || 'Enter your E-Mail'}}</small>
              </div>
              <input type="email" placeholder="E-Mail" v-model="email" @blur="eBlur">
            </div>
            <div :class="['_column', {_invalid: pError}]">
              <div :class="['_notf', {'_notf-v': !pError && password}]">
                <p>*&nbsp;</p><small>{{ pError || 'Enter your password'}}</small>
              </div>
              <input type="password" placeholder="Password" v-model="password" @blur="pBlur">
            </div>
          </div>
          <button :class="{ _btn: true, _disabled: pError || eError || isSubmitting }">
            <small>Log in</small>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

const router = useRouter()
const auth = useAuthStore()
const { handleSubmit, isSubmitting } = useForm()

const { value: email, errorMessage: eError, handleBlur: eBlur } = useField(
  'email',
  yup
    .string()
    .trim()
    .required('Enter your E-Mail')
    .email('Enter the correct E-Mail')
)

const { value: password, errorMessage: pError, handleBlur: pBlur } = useField(
  'password',
  yup
    .string()
    .trim()
    .required('Enter your password')
)
const onSubmit = handleSubmit(async values => {
  await auth.login(values)
  console.log(auth.isAuthenticated);
  setTimeout(() => console.log(auth.isAuthenticated), 100)
  
  if (auth.isAuthenticated) router.push('/')
})
</script>

<style scoped lang="scss">
.auth {
  display: flex;
  gap: var(--space);
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  padding: var(--space);
  border-radius: var(--br-rad);
  max-width: 824px;

  &__column {
    display: flex;
    flex-direction: column;
    gap: var(--space);
    justify-content: space-around;
  }

  & ._btn {
    width: 100%;
  }

  img {
    max-width: 300px;
    height: auto;
    border-radius: var(--br-rad);
  }
}
</style>