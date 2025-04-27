import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),"@tailwindcss/postcss"],
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
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  assetsInclude: ['**/*.gif', '**/*.GIF'],
});
scripts{
  npx @tailwindcss/cli -i ./src/Index.css -o ./src/output.css --watch

}
