<template>
  <section class="home">
    <div class="_column headers">
      <h1>Облачная Галерея</h1>
      <h2>Галерея для комфортного просмотра фотографий</h2>
      <p>Загружайте изображения и просматривайте их в любое время. А чтобы быстрее находить нужный контент — укажите парочку тегов для поиска в будущем</p>
      <RouterLink class="_btn" to="/gallery">
        <small>Перейти к Галереи</small>
      </RouterLink>
    </div>
    <div class="logo-wrapper">
      <LogoIcon />
    </div>
  </section>
</template>

<script setup lang="ts">
import LogoIcon from '@/assets/svg/LogoIcon.vue'
</script>

<style scoped lang="scss">
.home {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: var(--space);

  &__hidden {
    @media (max-width: 575px) {
      display: none;
    }
  }

  @media (max-width: 900px) {
    flex-direction: column;
  }
}

.logo-wrapper {
  min-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 750px) {
    svg {
      max-width: 250px;
      height: 100%;
    }
  }
}

.headers {
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