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
    // Ensure React is externalized since we're loading it from CDN
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        // Ensure vendor chunks are properly separated
        manualChunks: (id) => {
          // Create a vendor chunk for third-party libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || 
                id.includes('react-dom') || 
                id.includes('jsx-runtime')) {
              return; // Skip React since it's externalized
            }
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
    exclude: ["react", "react-dom"], // Exclude React since we're loading from CDN
    include: [
      "react-router-dom",
      "@radix-ui/react-toast",
      "lucide-react"
    ]
  }
}));
