import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5274,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://ec2-3-252-129-234.eu-west-1.compute.amazonaws.com/api',
        changeOrigin: true
      }
    }
  }
});

