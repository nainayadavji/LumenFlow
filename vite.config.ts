import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Keep this in sync with the `paths` alias in tsconfig.json.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    // Split the large Stellar SDK into its own chunk for better caching.
    rollupOptions: {
      output: {
        manualChunks: {
          stellar: ['@stellar/stellar-sdk', '@stellar/freighter-api'],
        },
      },
    },
  },
});
