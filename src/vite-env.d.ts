/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  readonly VITE_JWT_STORAGE_LOCATION?: "localStorage" | "sessionStorage";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
