/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_AUTH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
