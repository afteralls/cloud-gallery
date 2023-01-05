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
            <div @click="isFolderModal = true" class="actions__card act">
              <AddFolderIcon />
              <h3>Создать новую папку</h3>
            </div>
            <div @click="isTagModal = true" class="actions__card act">
              <HashtagIcon />
              <h3>Редактировать хештеги</h3>
            </div>
          </div>
          <div v-if="!auth.isAuthenticated" class="_tip">
            <InfoIcon />
            <h3>Для разблокировки новых действий необходимо авторизоваться</h3>
            <p>Это откроет вам доступ к разделу с избранным, позволит создавать новые личные/глобальные папки и редактировать данные</p>
          </div>
          <AppModal :isOpen="isFolderModal" @close-modal="isFolderModal = false">
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
                <label for="lc"><small>Личная</small></label>
              </div>
              <div
                @click="server.createFolder(folderName, folderType), isFolderModal = false" 
                class="_btn" 
                style="width: 100%"
              >
                <small>Создать</small>
              </div>
            </div>
          </AppModal>
          <AppModal :isOpen="isTagModal" @close-modal="isTagModal = false">
            <div @click="addTagtoDelete" class="_column">
              <small>Выберите папку</small>
              <AppFolderItem
                @click="isFolderModalFromTag = true"
                data-idx="0"
                :type="core.curFolder.type"
                :name="core.curFolder.name"
              />
              <div v-if="core.hashtagsCollection.length" class="_column">
                <small>Выберите теги, которые необходимо удалить</small>
                <div class="hash-row">
                  <div
                    v-for="(tag, idx) in core.hashtagsCollection"
                    :key="idx"
                    :data-idx="idx"
                    class="_btn _hash"
                  ><h5>{{ tag }}</h5></div>
                </div>
              </div>
              <div v-else class="hash-tip">
                <h5>Тегов пока нет, попробуйте пополнить коллекцию текущей директории</h5>
              </div>
            </div>
          </AppModal>
          <AppModal :is-open="isFolderModalFromTag" @close-modal="isFolderModalFromTag = false">
            <div @click="changeFolder" class="_folder-list">
              <small>Текущая</small>
              <AppFolderItem data-idx="0" :type="core.curFolder.type" :name="core.curFolder.name" />
              <small>Доступные</small>
              <AppFolderItem
                v-for="(folder, idx) in core.foldersCollection"
                :key="folder.name"
                :data-idx="idx"
                :type="folder.type"
                :name="folder.name"
              />
            </div>
          </AppModal>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import InfoIcon from '@/assets/svg/InfoIcon.vue'
import AppFolderItem from '../AppFolderItem.vue'
import AddFolderIcon from '@/assets/svg/AddFolderIcon.vue'
import AddImagesIcon from '@/assets/svg/AddImagesIcon.vue'
import HashtagIcon from '@/assets/svg/HashtagIcon.vue'
import AccountIcon from '@/assets/svg/AccountIcon.vue'
import AppModal from '@/components/AppModal.vue'
import CheckIcon from '@/assets/svg/CheckIcon.vue'
import { useServerStore } from '@/stores/serverStore.js'
import { useAuthStore } from '@/stores/authStore.js'
import { useCoreStore } from '@/stores/coreStore.js'
import { ref, onMounted } from 'vue'

const auth = useAuthStore()
const server = useServerStore()
const core = useCoreStore()

const isFolderModal = ref<boolean>(false)
const isTagModal = ref<boolean>(false)
const isFolderModalFromTag = ref<boolean>(false)
const folderName = ref<string>('')
const folderType = ref<string>('global')

const addTagtoDelete = (evt: any) => {
  if(evt.target.closest(['._hash'])) {
    const idx = evt.target.dataset.idx
    server.deleteTag(idx)
  }
}

const changeFolder = (evt: any) => {
  if (evt.target.closest(['.folder'])) {
    core.curFolder = core.foldersCollection[evt.target.dataset.idx]
    server.getData()
    isFolderModalFromTag.value = false
  }
}

onMounted(() => { server.getFolders(); server.getData() })
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

.hash-row {
  max-width: 350px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
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
