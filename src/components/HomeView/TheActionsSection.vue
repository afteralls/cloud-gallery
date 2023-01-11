<template>
<section class="actions">
  <div class="scroll">
    <div class="scroll-container">
      <div class="scroll-wrapper">
        <RouterLink to="/auth" v-if="!auth.isAuthenticated" class="card _column _tp-wp _center act">
          <AccountIcon />
          <h3>{{ $i18n('home.login') }}</h3>
        </RouterLink>
        <div v-else class="_row">
          <div class="card _tp-wp _center _column">
            <div class="_column">
              <small>{{ $i18n('home.hello') }}{{ auth.email }}</small>
            </div>
            <p>{{ $i18n('home.accTip') }}</p>
            <div @click="logoutHandler" class="_btn">
              <small>{{ $i18n('home.logout') }}</small>
            </div>
          </div>
          <RouterLink to="/upload" class="card _tp-wp _center _column act">
            <AddImagesIcon />
            <h3>{{ $i18n('home.addImages') }}</h3>
          </RouterLink>
          <div @click="showCreateModal = true" class="card _tp-wp _center _column act">
            <AddFolderIcon />
            <h3>{{ $i18n('home.createFolder') }}</h3>
          </div>
          <div @click="showTagModal = true" class="card _tp-wp _center _column act">
            <HashtagIcon />
            <h3>{{ $i18n('home.editHash') }}</h3>
          </div>
        </div>
        <div v-if="!auth.isAuthenticated" class="_tip">
          <InfoIcon />
          <h3>{{ $i18n('home.accTipTitle') }}</h3>
          <p>{{ $i18n('home.accTipDesc') }}</p>
        </div>
        <AppModal :isOpen="showCreateModal" @close-modal="showCreateModal = false">
          <div class="_column">
            <small>{{ $i18n('home.name') }}</small>
            <input v-model="folderName" type="text" placeholder="Mounts">
            <small>{{ $i18n('home.type') }}</small>
            <div class="_cb-wrapper">
              <Transition name="main"><CheckIcon v-if="folderType === 'global'" /></Transition>
              <input v-model="folderType" id="gl" type="radio" value="global">
              <label for="gl"><small>{{ $i18n('home.global') }}</small></label>
            </div>
            <div class="_cb-wrapper">
              <Transition name="main"><CheckIcon v-if="folderType === 'local'" /></Transition>
              <input v-model="folderType" id="lc" type="radio" value="local">
              <label for="lc"><small>{{ $i18n('home.privat') }}</small></label>
            </div>
            <div @click="createHandler" class="_btn">
              <small>{{ $i18n('home.create') }}</small>
            </div>
          </div>
        </AppModal>
        <AppModal :isOpen="showTagModal" @close-modal="showTagModal = false">
          <div @click="addTagToDelete" class="_column left">
            <small>{{ $i18n('app.curColder') }}</small>
            <AppFolderItem
              @click="showFolderList = true"
              data-idx="0"
              :type="core.curFolder.type"
              :name="core.curFolder.name"
            />
            <div v-if="core.hashtagsCollection.length" class="_column">
              <small>{{ $i18n('home.tagsToDelete') }}</small>
              <div class="_hash-row">
                <div
                  v-for="(tag, idx) in core.hashtagsCollection"
                  :key="idx"
                  :data-idx="idx"
                  class="_btn _hash"
                ><h5>{{ tag }}</h5></div>
              </div>
            </div>
            <h5 v-else>{{ $i18n('app.hashErr') }}</h5>
          </div>
        </AppModal>
        <AppModal :is-open="showFolderList" @close-modal="showFolderList = false">
          <AppFolderList @close-folder-list="showFolderList = false" />
        </AppModal>
      </div>
    </div>
  </div>
</section>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const server = useServerStore()
const core = useCoreStore()

const showCreateModal = ref<boolean>(false)
const showTagModal = ref<boolean>(false)
const showFolderList = ref<boolean>(false)

const folderName = ref<string>('')
const folderType = ref<string>('global')

const logoutHandler = async () => {
  auth.logout()
  await server.getDataHandler()
  core.curFolder = core.foldersCollection[0]
}
const createHandler = () => {
  server.createFolder(folderName.value, folderType.value)
  showCreateModal.value = false
}

const addTagToDelete = (evt: any) => {
  if(evt.target.closest(['._hash'])) {
    const idx = evt.target.dataset.idx
    server.deleteTag(idx)
  }
}
</script>

<style scoped lang="scss">
.actions {
  width: 100%;

  svg {
    width: 50px;
    height: auto;
  }
}

.card {
  height: var(--action-size);
  min-width: var(--action-size);
  max-width: var(--action-size);
  color: var(--txt-c);
  text-align: center;

  & ._btn { width: 100%; }

  @media (max-width: 750px) {
    height: calc(var(--action-size) / 1.1);
    min-width: calc(var(--action-size) / 1.1);
  }
}

.act {
  cursor: pointer;
  text-align: center;
  transition: var(--transition);
  justify-content: center;
  align-items: center;

  &:hover { background-color: var(--wrapper-c-h); }
}

.left { align-items: flex-start; }

.scroll {
  overflow-x: scroll;
  width: 100%;
  max-width: 100%;
}

.scroll-container {
  display: inline-block;
}

.scroll-wrapper {
  display: flex;
  width: 100%;
  gap: var(--space);
}
</style>
