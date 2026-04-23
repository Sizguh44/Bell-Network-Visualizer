import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// If you fork this repo under a different slug, change this constant to match.
// For GitHub user / organisation pages (served at the account root), set
// `base` below to `'/'` unconditionally instead.
const REPO_NAME = 'Bell-Network-Visualizer';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? `/${REPO_NAME}/` : '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
}));
