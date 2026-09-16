import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const DEFAULT_API_URL = "http://localhost:5001";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, "");
  const API_TARGET = process.env.VITE_API_URL || env.VITE_API_URL || DEFAULT_API_URL;
  const QUANT_TARGET = process.env.VITE_QUANT_ORIGIN || env.VITE_QUANT_ORIGIN || "http://localhost:5173";

  return {
    plugins: [react()],
    base: "/",
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
    server: {
      port: 5175,
      host: "0.0.0.0",
      watch:
        process.env.CHOKIDAR_USEPOLLING === "true"
          ? { usePolling: true, interval: Number(process.env.CHOKIDAR_INTERVAL ?? 1000) }
          : undefined,
      proxy: {
        "/api/quant": {
          target: API_TARGET,
          changeOrigin: true,
          secure: /^https:/.test(API_TARGET),
          cookieDomainRewrite: "",
          rewrite: (p) => p.replace(/^\/api\/quant/, "/api"),
        },
        "/quant": {
          target: QUANT_TARGET,
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 4175,
    },
  };
});
