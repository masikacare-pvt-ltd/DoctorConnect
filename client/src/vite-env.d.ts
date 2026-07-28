/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMULATOR_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
