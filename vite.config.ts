import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  // تعيين base إلى './' لضمان استخدام مسارات نسبية بعد عملية build
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
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
    port: 4000,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});
