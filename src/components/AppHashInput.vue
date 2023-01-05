<template>
  <div :class="{ 'hash-input': true, search: isSearch }">
    <input
      @focus="showTips = true"
      :value="modal"
      type="text"
      placeholder="#Art #Nature"
      @input="inputHandler"
    />
    <SearchIcon @click="searchHandler" v-if="isSearch" class="search-icon" />
    <Transition name="main">
      <div v-if="showTips" class="hash-tips">
        <div v-for="hash in core.hashtagsCollection" :key="hash" :data-hash="hash" class="_btn hash">
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

const props = defineProps<{ modal: string, isSearch?: boolean }>()
const emit = defineEmits<{
  (e: 'update:hashModel', value: string): void
  (e: 'update:addTag', value: string): void
}>()

const showTips = ref<boolean>(false)
const core = useCoreStore()

const inputHandler = (evt: any) => {
  emit('update:hashModel', evt.target.value)
}

const searchHandler = () => {
  if (props.modal !== '') {
    emit('update:hashModel', '')
    core.search(props.modal)
    showTips.value = false
  }
}

useEventListener(document, 'click', (evt: any) => {
  if (!evt.target.closest(['.search', '.hash-input']))
    showTips.value = false
  if (evt.target.closest(['.hash'])) {
    emit('update:addTag', `${evt.target.dataset.hash} `)
  }
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

  @media(max-width: 420px) {
    input {
      width: 100%;
    }
  }
}

.search {  
  input {
    padding: 0 27px 5px 0;
  }

  svg { height: 22px; }

  &-icon {
    position: absolute;
    right: 0;
    z-index: 11;
    bottom: 5px;
  }
}

.hash-tips {
  position: absolute;
  max-height: 130px;
  overflow-y: scroll;
  top: 25px;
  z-index: 30;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  background-color: var(--bg-c);
  padding: var(--space);
  border-radius: 0 0 var(--br-rad) var(--br-rad);
  gap: 5px;
}

.hash {
  padding: calc(var(--space) / 2);
  border-radius: calc(var(--br-rad) / 2);
  h5 {
    pointer-events: none;
    text-transform: uppercase;
    color: var(--dark-txt-c);
  }
}
</style>
