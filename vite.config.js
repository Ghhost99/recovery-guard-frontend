import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@styles': '/src/styles',
      '@images': '/public/images',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://recovery-guard-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  assetsInclude: ['**/*.gif', '**/*.GIF'],
});
