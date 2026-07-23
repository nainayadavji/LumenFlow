/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HORIZON_URL: string;
  readonly VITE_NETWORK_PASSPHRASE: string;
  readonly VITE_EXPLORER_URL: string;
  readonly VITE_FRIENDBOT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
