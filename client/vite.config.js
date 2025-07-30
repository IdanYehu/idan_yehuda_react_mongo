import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@src': '/src',          
      '@components': '/src/components',
      '@assets': '/src/assets',
      '@pages': '/src/pages',
      '@hooks': '/src/hooks',
      '@store': '/src/store',
      '@services':'/src/services'
    },
  },
});
