<template>
<div class="options">
  <RouterLink class="_i" to="/"><LogoIcon /></RouterLink>
  <div class="_br"></div>
  <div class="_i"><FoldersIcon @click="showFoldersModal = true" /></div>
  <AppModal :is-open="showFoldersModal" @close-modal="showFoldersModal = false">
    <AppFolderList @close-folder-list="showFoldersModal = false" />
  </AppModal>
  <AppHashInput
    :model="searchTags"
    :is-search="true"
    @update-model="(value) => searchTags = value"
    @add-tag="(value) => searchTags += value"
  />
  <div @click="showFiltersModal = true" class="_i"><FilterIcon /></div>
  <AppModal :is-open="showFiltersModal" @close-modal="showFiltersModal = false">
    <div class="_column">
      <small>{{ $i18n('nav.filter') }}</small>
      <div class="_row">
        <div
          @click="core.curFilter = 'date'"
          :class="{ '_btn': true, 'act': core.curFilter === 'date' }"
        ><small>{{ $i18n('nav.dateFilter') }}</small></div>
        <div
          @click="core.curFilter = 'user'"
          :class="{ '_btn': true, 'act': core.curFilter === 'user' }"
        ><small>{{ $i18n('nav.userFilter') }}</small></div>
      </div>
      <Transition name="main" mode="out-in">
        <TheSelect
          v-if="core.curFilter === 'date'"
          :model="core.curDate"
          :items="core.dateCollection"
          @update-data="(value) => core.curDate = value"
        />
        <TheSelect
          v-else-if="core.curFilter === 'user'"
          :model="core.curUploader"
          :items="core.uploaders"
          @update-data="(value) => core.curUploader = value"
        />
      </Transition>
      <div @click="core.deepSearch(), showFiltersModal = false" class="_btn">
        <small>{{ $i18n('nav.search') }}</small>
      </div>
      <small>{{ $i18n('nav.load') }}</small>
      <div @click="core.galleryCollection = core.imageCollection, showFiltersModal = false" class="_btn">
        <small>{{ $i18n('nav.loadAll') }}</small>
      </div>
    </div>
  </AppModal>
</div>
</template>

<script setup lang="ts">
const core = useCoreStore()
const searchTags = ref<string>('')
const showFoldersModal = ref<boolean>(false)
const showFiltersModal = ref<boolean>(false)
</script>

<style scoped lang="scss">
.options {
  display: flex;
  align-items: center;
  gap: var(--space);
  height: 100%;
}

.act {
  background-color: green;

  &:hover {
    background-color: rgba(0, 128, 0, 0.8);
  }
}
</style>
