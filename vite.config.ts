import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // For GitHub Pages: change '/KVL/' if your repo name is different.
  base: '/KVL/',
});
