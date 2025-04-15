import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-test-html',
      closeBundle() {
        // Ensure test.html is copied to the root of the dist directory
        if (fs.existsSync('public/test.html')) {
          fs.copyFileSync('public/test.html', 'dist/test.html')
          console.log('Successfully copied test.html to dist directory')
        }
      }
    }
  ],
  root: '.', // Explicitly set the root directory
  base: '/', // Changed from './' to '/' for proper SPA routing in production
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
