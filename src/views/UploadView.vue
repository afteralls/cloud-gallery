<template>
<div class="_wrapper">
  <section class="_column upload">
    <ThePreview />
    <div class="upload-row">
      <TheDropZone />
      <TheUploadSettings />
    </div>
  </section>
</div>
</template>

<style scoped lang="scss">
.upload {
  align-items: center;
  width: 100%;
}

.upload-row {
  display: flex;
  height: 100%;
  gap: var(--space);

  @media(max-width: 910px) {
    flex-direction: column;
  }
}
</style>
