import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": "http://localhost:8080",
      "/uploads": "http://localhost:8080"
    }
  },
  build: {
    target: "es2022",
    sourcemap: true
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"]
  }
});
