<template>
<div class="copyright-row _center">
  <small>Made with</small>
  <HeartIcon />
  <small>by <a href="https://t.me/afterallspace">Daniil Sukharnikov</a></small>
</div>
</template>

<style scoped lang="scss">
.copyright-row {
  gap: 5px;
  flex-wrap: wrap;

  svg { fill: red; }
  
  a {
    transition: var(--transition);

    &:hover {
      color: var(--accent-c);
    }
  }
}
</style>
