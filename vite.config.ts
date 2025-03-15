import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  // تعيين base إلى './' لضمان استخدام مسارات نسبية بعد عملية build
  base: './',
  plugins: [
    react(),
    tsconfigPaths()
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets', // اختياري لكن مفيد للتنظيم
  },
  server: {
    port: 4000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});
