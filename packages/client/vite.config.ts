import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, "../../dist"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:1999",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@shared": "../shared/src",
    },
  },
});
