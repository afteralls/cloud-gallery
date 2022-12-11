/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CUR_LANG: string
  readonly VITE_I18N: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}