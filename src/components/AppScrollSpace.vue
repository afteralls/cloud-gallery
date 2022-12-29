<template>
  <div class="scroll">
    <div class="scroll__container">
      <div class="scroll__wrapper">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.scroll {
  overflow-x: scroll;
  width: 100%;
  max-width: 100%;

  &__container {
    display: inline-block;
  }

  &__wrapper {
    display: flex;
    width: 100%;
    gap: var(--space);
  }
}
</style>
