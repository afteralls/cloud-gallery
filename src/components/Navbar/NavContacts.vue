<template>
<a href="https://github.com/post-apocalypse" :title="$i18n('nav.git')" class="_i"><GitHubIcon /></a>
<a href="https://t.me/afterallspace" :title="$i18n('nav.telegram')" class="_i"><TelegramIcon /></a>
</template>

<script setup lang="ts">
import TelegramIcon from '@/assets/svg/TelegramIcon.vue'
import GitHubIcon from '@/assets/svg/GitHubIcon.vue'
</script>
