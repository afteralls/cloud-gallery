<template>
  <section class="actions">
    <div class="scroll">
      <div class="scroll__container">
        <div class="scroll__wrapper">
          <RouterLink to="/auth" v-if="!auth.isAuthenticated" class="actions__card act">
            <AccountIcon />
            <h3>Войти в аккаунт</h3>
          </RouterLink>
          <div v-else class="_row">
            <div class="actions__card account">
              <div class="actions__row">
                <AccountIcon />
                <div>
                  <p>Здравствуйте,</p>
                  <h3>{{ auth.email }}</h3>
                </div>
              </div>
              <p>У вас есть полный доступ к колекции и всему функционалу, наслаждайтесь!</p>
              <div @click="auth.logout" class="_btn">
                <small>Выйти</small>
              </div>
            </div>
            <RouterLink to="/upload" class="actions__card act">
              <AddImagesIcon />
              <h3>Пополнить коллекцию</h3>
            </RouterLink>
            <div @click="isOpen = true" class="actions__card act">
              <AddFolderIcon />
              <h3>Создать новую папку</h3>
            </div>
          </div>
          <AppModal :isOpen="isOpen" @close-modal="isOpen = false">
            <div class="_column">
              <small>Название</small>
              <input v-model="folderName" type="text" placeholder="Mounts">
              <small>Тип</small>
              <div class="_cb-wrapper">
                <Transition name="main"><CheckIcon v-if="folderType === 'global'" /></Transition>
                <input v-model="folderType" id="gl" type="radio" value="global">
                <label for="gl"><small>Глобальная</small></label>
              </div>
              <div class="_cb-wrapper">
                <Transition name="main"><CheckIcon v-if="folderType === 'local'" /></Transition>
                <input v-model="folderType" id="lc" type="radio" value="local">
                <label for="lc"><small>Локальная</small></label>
              </div>
              <div
                @click="main.createFolder(folderName, folderType), isOpen = false" 
                class="_btn" 
                style="width: 100%"
              >
                <small>Создать</small>
              </div>
            </div>
          </AppModal>
          <div v-if="!auth.isAuthenticated" class="_tip">
            <InfoIcon />
            <h3>Для разблокировки новых действий необходимо авторизоваться</h3>
            <p>Это откроет вам доступ к разделу с избранным, позволит создавать новые личные/глобальные папки и редактировать данные</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import InfoIcon from '@/assets/svg/InfoIcon.vue'
import AddFolderIcon from '@/assets/svg/AddFolderIcon.vue'
import AddImagesIcon from '@/assets/svg/AddImagesIcon.vue'
import AccountIcon from '@/assets/svg/AccountIcon.vue'
import AppModal from '@/components/AppModal.vue'
import CheckIcon from '@/assets/svg/CheckIcon.vue'
import { useMainStore } from '@/stores/mainStore.js'
import { useAuthStore } from '@/stores/authStore.js'
import { ref } from 'vue'

const auth = useAuthStore()
const main = useMainStore()

const isOpen = ref<boolean>(false)
const folderName = ref<string>('')
const folderType = ref<string>('global')
</script>

<style scoped lang="scss">
.actions {
  width: 100%;

  svg {
    width: 50px;
    height: auto;
  }

  &__row {
    display: flex;
    align-items: center;
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
}

.act {
  cursor: pointer;
  text-align: center;
  transition: var(--transition);
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: var(--wrapper-c-h);
  }
}

.account {
  justify-content: space-between;
  p { text-align: center; }
}

.scroll {
  overflow-x: scroll;
  width: 100%;
  max-width: 100%;

  &__container {
    display: inline-block;
  }

  &__wrapper {
    display: flex;
    width: 100%;
    gap: var(--space);
  }
}
</style>