import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative paths for both Web and Electron desktop
  server: {
    port: 5173,
    strictPort: true
  }
});
