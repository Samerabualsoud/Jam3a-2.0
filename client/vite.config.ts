import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // Explicitly set the root directory
  base: './', // This helps with routing in production
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    // Add allowedHosts configuration to fix CORS issues
    allowedHosts: ['jam3a.me', 'www.jam3a.me', 'localhost', 'king-prawn-app-pzj4u.ondigitalocean.app', '*.ondigitalocean.app'],
    // Enable CORS for all origins
    cors: true
  },
})
