import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",   // paths relative
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        format: "esm" // module format
      }
    }
  }
});
