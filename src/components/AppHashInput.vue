<template>
  <div :class="{ 'hash-input': true, search: isSearch }">
    <input
      @focus="showTips = true"
      v-model="hashModel"
      type="text"
      @change="changeModel"
      placeholder="#Art #Nature"
    />
    <SearchIcon v-if="isSearch" class="search-icon" />
    <Transition name="main">
      <div v-if="showTips" class="hash-tips">
        <div v-for="hash in main.hashCollection" :key="hash" :data-hash="hash" class="_btn hash">
          <h5>{{ hash }}</h5>
        </div>
        <h5 v-if="!main.hashCollection.length">
          Тегов пока нет, попробуйте пополнить коллекцию текущей директории
        </h5>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchIcon from '@/assets/svg/SearchIcon.vue'
import { useMainStore } from '@/stores/mainStore'
import { useEventListener } from '@vueuse/core'

defineProps<{ isSearch?: boolean }>()
const emit = defineEmits<{ (e: 'update:hashModel', value: string): void }>()
const hashModel = ref<string>('')
const changeModel = (evt: any) => { emit('update:hashModel', evt.target?.value) }

const showTips = ref<boolean>(false)
const main = useMainStore()

useEventListener(document, 'click', (evt: any) => {
  if (!evt.target.closest(['.search', '.hash-input']))
    showTips.value = false
  if (evt.target.closest(['.hash']))
    hashModel.value += `${evt.target.dataset.hash} `
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
    bottom: 5px;
  }
}

.hash-tips {
  position: absolute;
  top: 25px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
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