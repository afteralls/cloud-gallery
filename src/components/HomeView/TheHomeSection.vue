<template>
<section class="home _row">
  <div class="_column headers">
    <h1>{{ $i18n('home.title') }}</h1>
    <h2>{{ $i18n('home.subTitle') }}</h2>
    <p>{{ $i18n('home.desc') }}</p>
    <RouterLink class="_btn" to="/gallery">
      <small>{{ $i18n('home.goToGallery') }}</small>
    </RouterLink>
  </div>
  <div class="logo-wrapper _center">
    <img src="@/assets/img/main.png" alt="Home Image">
  </div>
</section>
</template>

<style scoped lang="scss">
.home {
  width: 100%;
  justify-content: space-between;

  @media (max-width: 900px) {
    flex-direction: column;
  }
}

.logo-wrapper {
  height: auto;
  min-width: 350px;

  img {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 750px) {
    img { max-width: 300px; }
  }
}

.headers {
  align-items: flex-start;

  h1 { font-size: 4rem; }
  h2 { font-size: 2rem; }
  p { font-size: 1.2rem; }

  @media (max-width: 1200px) {
    h1 { font-size: 3rem; }
    h2 { font-size: 1.5rem; }
    p { font-size: 1rem; }
  }

  @media (max-width: 900px) {
    order: 2;
    align-items: center;
    text-align: center;

    h1 { font-size: 2.5rem; }
    h2 { font-size: 1.5rem; }
    p { font-size: 1rem; }
  }

  @media (max-width: 575px) {
    h1 { font-size: 2rem; }
    h2 { font-size: 1.2rem; }
    p { font-size: 1rem; }
  }
}
</style>
