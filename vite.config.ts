import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';


export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()

  ],
  server: {
    port: 4000
},
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});
