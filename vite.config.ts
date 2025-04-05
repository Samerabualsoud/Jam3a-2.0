import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./", // Use relative paths for assets
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: mode === "development",
    minify: mode !== "development",
    // Ensure CSS is extracted to avoid FOUC (Flash of Unstyled Content)
    cssCodeSplit: true,
    // Improve chunking strategy
    rollupOptions: {
      output: {
        // Ensure vendor chunks are properly separated
        manualChunks: {
          vendor: [
            'react', 
            'react-dom', 
            'react-router-dom',
            '@radix-ui/react-toast',
            'lucide-react'
          ],
          // Add UI components to their own chunk
          ui: [
            '@/components/ui',
          ],
        },
        // Ensure asset filenames include hashes for cache busting
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    // Ensure proper handling of dynamic imports
    dynamicImportVarsOptions: {
      warnOnError: true,
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Ensure proper extension resolution
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@radix-ui/react-toast',
      'lucide-react'
    ],
    // Force include problematic dependencies
    force: true,
  },
  // Ensure proper handling of CSS
  css: {
    devSourcemap: true,
  },
  // Ensure proper handling of public assets
  publicDir: 'public',
}));
