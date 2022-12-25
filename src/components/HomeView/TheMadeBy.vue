<template>
  <div class="madeby">
    <small>Made with</small>
    <HeartIcon />
    <small>by <a href="https://t.me/afterallspace">Daniil Sukharnikov</a></small>
  </div>
</template>

<script setup lang="ts">
import HeartIcon from '@/assets/svg/HeartIcon.vue'
</script>

<style scoped lang="scss">
.madeby {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;

  svg {
    fill: var(--txt-c);
    fill: red;
  }

  a { transition: var(--transition); }
  a:hover { color: var(--accent-c); }
}
</style>