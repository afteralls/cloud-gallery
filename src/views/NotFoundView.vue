<template>
  <div class="not-found">
    <img src="../assets/img/gallery-logo.webp" alt="Штрих-код">
    <div class="not-found__info">
      <h1>Oops... It seems you're lost</h1>
      <p>The page you were trying to find was not found</p>
      <router-link class="link" style="max-width: 300px;" to="/">
        <div class="_img-wrapper"><img src="../assets/img/arrow-left.webp" alt="To Home"></div>
        <h3>Go back to the Gallery</h3>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/scss/main';

.not-found {
  @include all-cent;
  @include glass-effect;
  padding: $space;
  gap: $space;
  max-width: 800px;
  margin: $space;

  &__info {
    display: flex;
    justify-content: center;
    gap: $space;
    flex-direction: column;

    @media (max-width: $extra-medium) {
      text-align: center;
      align-items: center;
    }
  }

  @media (max-width: $extra-medium) {
    flex-direction: column;
  }

  img {
    height: 250px;
    width: auto;
  }
}
</style>
