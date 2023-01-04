<template>
  <div @click="open = !open" class="select">
    <ArrowIcon :class="{ select__arrow: true, rotate: open }" />
    <div class="select__selected"><small>{{ model }}</small></div>
    <Transition name="main">
      <div v-show="open" class="select__items">
        <div
          class="select__item"
          v-for="item of items" :key="item"
          @click="$emit('updateData', item), !open"
        >
          <small>{{ item }}</small>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import ArrowIcon from '@/assets/svg/ArrowIcon.vue'
import { ref } from 'vue'
import { useEventListener } from '@vueuse/core'

defineProps<{ model: string, items: string[] }>()
defineEmits<{ (e: 'updateData', value: string): void }>()

const open = ref(false)
useEventListener(document, 'click', (evt: any) => {
  if (!evt.target?.closest('.select')) {
    open.value = false
  }
})
</script>

<style lang="scss">
.select {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  outline: none;
  cursor: pointer;

  &__selected {
    display: flex;
    align-items: center;
    width: 100%;
    padding: var(--space);
    background-color: var(--wrapper-c-h);
    border-radius: var(--br-rad);
    color: var(--txt-c);
    user-select: none;
    transition: var(--transition);
    pointer-events: none;
    z-index: 20;
  }

  &__arrow {
    z-index: 21;
    position: absolute;
    right: 0;
    transition: var(--transition);
    fill: var(--txt-c-h);
    height: 100%;
    pointer-events: none;
  }

  &__items {
    display: flex;
    flex-direction: column;
    border-radius: var(--br-rad);
    position: absolute;
    top: 47px;
    background-color: var(--wrapper-c);
    width: 100%;
    box-sizing: border-box;
    z-index: 30;
    transition: var(--transition);
  }

  &__item {
    padding: var(--space);
    border-radius: var(--br-rad);
    user-select: none;

    &:hover {
      background-color: var(--wrapper-c-h);
    }
  }
}

.rotate {
  transform: rotate(180deg);
}
</style>
