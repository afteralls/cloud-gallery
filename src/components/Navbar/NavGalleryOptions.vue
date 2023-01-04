<template>
<div class="options">
  <RouterLink to="/"><LogoIcon /></RouterLink>
  <div class="_br"></div>
  <NavFoldersMenu />
  <AppHashInput :is-search="true" @update:hashModel="(value) => main.searchTags = value" />
  <div @click="showFilters = true" class="stable"><FilterIcon /></div>
  <AppModal :is-open="showFilters" @close-modal="showFilters = false">
    <div class="filters">
      <small>Фильтр</small>
      <div class="_row">
        <div @click="main.curFilter = 'date'" :class="{ '_btn': true, 'act': main.curFilter === 'date' }">
          <small>По дате</small>
        </div>
        <div @click="main.curFilter = 'user'" :class="{ '_btn': true, 'act': main.curFilter === 'user' }">
          <small>По пользователю</small>
        </div>
      </div>
      <Transition name="main" mode="out-in">
        <TheSelect
          v-if="main.curFilter === 'date'"
          :model="main.curDate"
          :items="main.dateCollection"
          @update-data="(value) => main.curDate = value"
        />
        <TheSelect
          v-else-if="main.curFilter === 'user'"
          :model="main.curUploader"
          :items="main.uploaders"
          @update-data="(value) => main.curUploader = value"
        />
      </Transition>
      <div @click="main.deepSearch(), showFilters = false" class="_btn">
        <small>Поиск</small>
      </div>
      <small>Загрузка полной коллекции</small>
      <div @click="main.galleryCollection = main.imageCollection, showFilters = false" class="_btn">
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
import { useMainStore } from '@/stores/mainStore'

const main = useMainStore()
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

.act {
  background-color: green;

  &:hover {
    background-color: rgba(0, 128, 0, 0.8);
  }
}
</style>