<template>
<div class="made-by _center">
  <small>Made with</small>
  <HeartIcon />
  <small>by <a href="https://t.me/afterallspace">Daniil Sukharnikov</a></small>
</div>
</template>

<script setup lang="ts">
import HeartIcon from '@/assets/svg/HeartIcon.vue'
</script>

<style scoped lang="scss">
.made-by {
  gap: 5px;
  flex-wrap: wrap;

  svg { fill: red; }
  a { transition: var(--transition); }
  a:hover { color: var(--accent-c); }
}
</style>
