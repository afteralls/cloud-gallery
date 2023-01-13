<template>
  <div class="_wrapper">
    <div class="_app-info _column _center">
      <InfoIcon />
      <h1>{{ $i18n('nFound.title') }}</h1>
      <h3>{{ $i18n('nFound.desc') }}</h3>
      <RouterLink class="_btn" to="/" :title="$i18n('nav.home')">
        <small>{{ $i18n('nFound.goHome') }}</small>
      </RouterLink>
    </div>
  </div>
</template>
  