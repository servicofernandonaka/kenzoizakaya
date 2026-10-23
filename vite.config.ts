import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' => o build estático funciona em qualquer subpasta / CDN / file server.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2020', sourcemap: false },
});
