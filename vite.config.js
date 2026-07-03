import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true, // Génère les sourcemaps comme dans la config Gulp
  },
  server: {
    port: 3000,
    open: true,
  }
});
