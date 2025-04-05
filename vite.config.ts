import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/", // Use absolute paths for server-based approach
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: mode === "development",
    minify: mode !== "development",
    // Improve chunking strategy
    rollupOptions: {
      // Remove external declarations that cause JSX runtime issues
      output: {
        // Ensure vendor chunks are properly separated
        manualChunks: (id) => {
          // Create a vendor chunk for third-party libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    // Ensure the build doesn't fail on dynamic imports
    chunkSizeWarningLimit: 1000,
    // Improve CSS handling
    cssCodeSplit: true,
    // Generate manifest for better asset tracking
    manifest: true
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react-router-dom",
      "@radix-ui/react-toast",
      "lucide-react",
      "axios"
    ]
  }
}));
