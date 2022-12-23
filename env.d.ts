/// <reference types="vite/client" />

declare module 'vue' {
  interface ComponentCustomProperties {
    $i18n: (key: string) => string
  }
}

declare module 'vue-router' {
  interface RouteLocationNormalized {
    name: string
  }
}

interface ImportMetaEnv {
  readonly VITE_CUR_LANG: string
  readonly VITE_I18N: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {}