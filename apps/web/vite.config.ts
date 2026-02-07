import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

// @ts-ignore process is a nodejs global
const host = process.env.TAURI_DEV_HOST;
// @ts-ignore process is a nodejs global
const isTauri = !!process.env.TAURI_ENV_PLATFORM;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [
    tanstackRouter({
      target: "react",
      routesDirectory: "./src/routers",
      generatedRouteTree: "./src/routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],

  // Resolve path aliases
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@routers": path.resolve(__dirname, "./src/routers"),
    },
  },

  // Clear screen only in non-Tauri mode (Tauri needs to see rust errors)
  clearScreen: !isTauri,

  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // Tell Vite to ignore watching `src-tauri` when in Tauri mode
      ignored: isTauri ? ["**/src-tauri/**"] : [],
    },
  },

  // Define environment variables for platform detection
  define: {
    __TAURI_ENV__: isTauri,
  },
}));
