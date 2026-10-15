import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'lucide-react': path.resolve(__dirname, './node_modules/lucide-react/dist/cjs/lucide-react.js'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
