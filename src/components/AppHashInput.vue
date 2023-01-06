<template>
<div :class="{ 'hash-input': true, 'search': isSearch }">
  <input
    @focus="showTips = true"
    :value="model"
    type="text"
    placeholder="#Art #Nature"
    @input="inputHandler"
  />
  <SearchIcon @click="searchHandler" v-if="isSearch" class="search-icon" />
  <Transition name="main" mode="out-in">
    <div v-if="showTips" class="hash-tips _hash-row">
      <div v-for="hash in core.hashtagsCollection" :key="hash" :data-hash="hash" class="_btn _hash">
        <h5>{{ hash }}</h5>
      </div>
      <h5 v-if="!core.hashtagsCollection.length">
        Тегов пока нет, попробуйте пополнить коллекцию текущей директории
      </h5>
    </div>
  </Transition>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchIcon from '@/assets/svg/SearchIcon.vue'
import { useCoreStore } from '@/stores/coreStore'
import { useEventListener } from '@vueuse/core'

const props = defineProps<{ model: string, isSearch?: boolean }>()
const emit = defineEmits<{ (e: 'updateModel', value: string): void, (e: 'addTag', value: string): void }>()

const core = useCoreStore()
const showTips = ref<boolean>(false)

const inputHandler = (evt: any) => emit('updateModel', evt.target.value)

const searchHandler = () => {
  if (props.model !== '') {
    emit('updateModel', '')
    core.search(props.model)
    showTips.value = false
  }
}

useEventListener(document, 'click', (evt: any) => {
  if (!evt.target.closest(['.search', '.hash-input']))
    showTips.value = false
  if (evt.target.closest(['._hash']))
    emit('addTag', `${evt.target.dataset.hash} `)
})
</script>

<style scoped lang="scss">
.hash-input {
  display: flex;
  align-items: center;
  position: relative;
  height: auto;

  input {
    width: 200px;
    box-sizing: border-box;
    padding: 0 0 5px 0;
    background-color: transparent;
    border-radius: 0;
    border-bottom: 2px solid var(--txt-c);
  }

  @media(max-width: 525px) {
    input { width: 100%; }
  }
}

.search {  
  input { padding: 0 27px 5px 0; }
  svg { height: 22px; }
}

.search-icon {
  position: absolute;
  right: 0;
  bottom: 5px;
}

.hash-tips {
  position: absolute;
  max-height: 130px;
  overflow-y: scroll;
  top: 25px;
  z-index: 9;
  width: 100%;
  text-align: center;
  background-color: var(--bg-c);
  padding: var(--space);
  border-radius: 0 0 var(--br-rad) var(--br-rad);
}
</style>
