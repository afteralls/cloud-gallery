/// <reference types="vite/client" />

export {}

declare module 'vue' {
  export interface ComponentCustomProperties {
    $i18n: (key: string) => string
  }
}

declare global {
  export interface LangProps { [key: string]: any }
  export interface Errors { [key: string]: string }

  export interface ClientData { email: string, password: string }

  export interface Folder { name: string, type: string }
  export interface PreviewInfo { name?: string, src?: string, size?: string }

  export interface RefAndUpl {
    folderName: string
    folderType: string
    fileName: string
    collection: Image[] | string[] | []
  }

  export interface Image {
    name: string
    hashtags: string
    src: string
    uploader: string
    created: string
    isFavorite?: boolean
  }
}
