<template>
<div class="options">
  <RouterLink to="/"><LogoIcon /></RouterLink>
  <div class="_br"></div>
  <NavFoldersMenu />
  <AppHashInput
    :modal="searchTags"
    :is-search="true"
    @update:hashModel="(value) => searchTags = value"
    @update:addTag="(value) => searchTags += value"
  />
  <div @click="showFilters = true" class="stable"><FilterIcon /></div>
  <AppModal :is-open="showFilters" @close-modal="showFilters = false">
    <div class="filters">
      <small>Фильтр</small>
      <div class="_row">
        <div @click="core.curFilter = 'date'" :class="{ '_btn': true, '_act': core.curFilter === 'date' }">
          <small>По дате</small>
        </div>
        <div @click="core.curFilter = 'user'" :class="{ '_btn': true, '_act': core.curFilter === 'user' }">
          <small>По пользователю</small>
        </div>
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
      <div @click="core.deepSearch(), showFilters = false" class="_btn">
        <small>Поиск</small>
      </div>
      <small>Загрузка полной коллекции</small>
      <div @click="core.galleryCollection = core.imageCollection, showFilters = false" class="_btn">
        <small>Загрузить всё</small>
      </div>
    </div>
  </AppModal>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LogoIcon from '@/assets/svg/LogoIcon.vue'
import FilterIcon from '@/assets/svg/FilterIcon.vue'
import NavFoldersMenu from './NavFoldersMenu.vue'
import AppHashInput from '../AppHashInput.vue'
import AppModal from '../AppModal.vue'
import TheSelect from './TheSelect.vue'
import { useCoreStore } from '@/stores/coreStore'

const core = useCoreStore()
const searchTags = ref<string>('')
const showFilters = ref<boolean>(false)
</script>

<style scoped lang="scss">
.options {
  display: flex;
  align-items: center;
  gap: var(--space);
  height: 100%;
}

.stable {
  display: flex;
  align-items: center;
  svg {
    min-width: 24px !important;
  }
}

.filters {
  display: flex;
  flex-direction: column;
  gap: var(--space);
}
</style>