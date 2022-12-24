<template>
  <section class="actions">
    <div class="actions__container">
      <div class="actions__wrapper">
        <RouterLink to="/auth" v-if="!auth.isAuthenticated" class="actions__card actions__card-act">
          <AccountIcon />
          <h3>Войти в аккаунт</h3>
        </RouterLink>
        <div v-else class="_row">
          <div class="actions__card actions__account">
            <AccountIcon />
            <div>
              <p>Здравствуйте,</p>
              <h3>{{ auth.email }}</h3>
            </div>
            <p>Теперь, у вас есть полный доступ к колекции, наслаждайтесь!</p>
            <div @click="auth.logout" class="_btn">
              <small>Выйти</small>
            </div>
          </div>
          <div class="actions__card actions__card-act">
            <AddFolderIcon />
            <h3>Создать новую папку</h3>
          </div>
        </div>
        <RouterLink
          v-for="(temp, idx) in actions"
          :to="temp.path"
        >
          <TheAction :idx="idx" :link="temp.path" @del-temp="(idx) => actions.splice(idx, 1)">
            <template #codename><h3>{{ temp.foldName }}</h3></template>
            <template #desc><p>{{ temp.desc }}</p></template>
          </TheAction>
        </RouterLink>
        <div v-if="!auth.isAuthenticated" class="actions__tip">
          <InfoIcon />
          <h3>Для разблокировки новых действий необходимо авторизоваться</h3>
          <p>Это откроет вам доступ к разделу с избранным, позволит создавать новые личные/глобальные папки и редактировать данные</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import TheAction from './TheAction.vue'
import InfoIcon from '@/assets/svg/InfoIcon.vue'
import AddFolderIcon from '@/assets/svg/AddFolderIcon.vue'
import AccountIcon from '@/assets/svg/AccountIcon.vue'
import { useMainStore } from '@/stores/mainStore.js'
import { useAuthStore } from '@/stores/authStore.js'

const auth = useAuthStore()
const { actions } = useMainStore()
</script>

<style scoped lang="scss">
.actions {
  overflow-x: scroll;
  width: 100%;
  max-width: 100%;

  svg {
    width: 50px;
    height: auto;
  }

  &__container { display: inline-block; }

  &__wrapper {
    display: flex;
    width: 100%;
    gap: var(--space);
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: var(--space);
    background-color: var(--tp-c);
    backdrop-filter: blur(8px);
    border-radius: var(--br-rad);
    padding: var(--space);
    height: var(--action-size);
    min-width: var(--action-size);
    max-width: var(--action-size);
    color: var(--txt-c);

    @media (max-width: 750px) {
      height: calc(var(--action-size) / 1.1);
      min-width: calc(var(--action-size) / 1.1);
    }
  }

  &__card-act {
    cursor: pointer;
    text-align: center;
    transition: var(--transition);
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: var(--wrapper-c-h);
    }
  }

  &__tip {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    gap: var(--space);
    max-width: 350px;
    min-width: 350px;
  }
}
</style>