// vite.config.js for static deployment
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-tooltip', '@radix-ui/react-dialog', '@radix-ui/react-tabs'],
        },
      },
    },
    // Generate static files with hash for cache busting
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    sourcemap: false,
    // Ensure we generate _redirects file for Netlify
    emptyOutDir: true,
  },
  // Configure server for development
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
  // Configure preview server
  preview: {
    port: 3000,
    strictPort: true,
    host: true,
  },
});
