export interface LangProps { [key: string]: string | object }
export interface Errors { [key: string]: string }

export interface ClientData { email: string, password: string }

export interface Folder { name: string, type: string }
export interface PreviewInfo { name?: string, src?: string, size?: string }
export interface Image { name: string, hashtags: string, src: string, uploader: string, created: string }

export interface ZoomData { [key: string]: number }
