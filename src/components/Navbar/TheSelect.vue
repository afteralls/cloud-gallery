<template>
<div @click="isOpen = !isOpen" class="select">
  <ArrowIcon :class="{ 'select-arrow': true, 'rotate': isOpen }" />
  <div class="selected"><small>{{ model }}</small></div>
  <Transition name="main" mode="out-in">
    <div v-show="isOpen" class="select-items">
      <div class="select-item" v-for="item of items" :key="item" :data-item="item">
        <small>{{ item }}</small>
      </div>
    </div>
  </Transition>
</div>
</template>

<script setup lang="ts">
defineProps<{
  model: string
  items: string[]
}>()

const emit = defineEmits<{
  (e: 'updateData', value: string): void
}>()

const isOpen = ref(false)

useEventListener(document, 'click', (evt: MouseEvent) => {
  const target = evt.target as HTMLElement

  if (!target.closest('.select'))
    isOpen.value = false
  if (target.closest('.select-item')) {
    emit('updateData', target.dataset.item!)
    isOpen.value = false
  }
})
</script>

<style scoped lang="scss">
.select {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  outline: none;
  cursor: pointer;
}

.selected, .select-arrow, .select-items, .select-item {
  border-radius: var(--br-rad);

  small, svg {
    pointer-events: none;
    transition: var(--transition);
  }
}

.selected {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--space);
  background-color: var(--wrapper-c-h);
  color: var(--txt-c);
}

.select-arrow {
  position: absolute;
  right: 0;
  fill: var(--txt-c-h);
  height: 100%;
}

.select-items {
  position: absolute;
  max-height: 130px;
  overflow-y: scroll;
  top: 50px;
  background-color: var(--wrapper-c);
  width: 100%;
}

.select-item {
  padding: var(--space);

  &:hover { background-color: var(--wrapper-c-h); }
}

.rotate { transform: rotate(180deg); }
</style>
