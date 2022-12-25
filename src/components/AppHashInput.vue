<template>
  <div class="search">
    <input @focus="showTips = true" v-model="hashSearch" type="text" placeholder="#Art #Nature">
    <SearchIcon class="search-icon" />
    <Transition name="main">
      <div v-if="showTips" class="hash-tips">
        <div v-for="hash in main.hashCollection" :key="hash" :data-hash="hash" class="_btn hash">
          <p>{{ hash }}</p>
        </div>
        <p v-if="!main.hashCollection.length">Тегов пока нет, попробуйте пополнить коллекцию текущей директории</p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchIcon from '@/assets/svg/SearchIcon.vue'
import { useMainStore } from '@/stores/mainStore'
import { useEventListener } from '@vueuse/core'

const showTips = ref<boolean>(false)
const hashSearch = ref<string>('')
const main = useMainStore()

useEventListener(document, 'click', (evt: any) => {
  if (!evt.target.closest(['.search']))
    showTips.value = false
  if (evt.target.closest(['.hash']))
    hashSearch.value += `${evt.target.dataset.hash} `
})
</script>

<style scoped lang="scss">
.search {
  display: flex;
  align-items: center;
  position: relative;
  
  input {
    width: 200px;
    box-sizing: border-box;
    padding: 0 27px 5px 0;
    background-color: transparent;
    border-radius: 0;
    border-bottom: 2px solid var(--txt-c);
  }

  svg { height: 22px; }

  &-icon {
    position: absolute;
    right: 0;
    bottom: 5px;
  }

  @media(max-width: 420px) {
    input {
      width: 100%;
    }
  }
}

.hash-tips {
  position: absolute;
  top: 25px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  // justify-content: center;
  background-color: var(--tp-c);
  backdrop-filter: blur(8px);
  padding: var(--space);
  border-radius: 0 0 var(--br-rad) var(--br-rad);
  gap: 5px;
  p { text-align: center; }
}

.hash {
  padding: calc(var(--space) / 2);
  border-radius: calc(var(--br-rad) / 2);
  p { pointer-events: none; }
}
</style>