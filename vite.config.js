import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  base: "/FunTime_project/",   
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:5002",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Ensure public files are copied
    copyPublicDir: true
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  }
});
