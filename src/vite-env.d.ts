/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MY_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
