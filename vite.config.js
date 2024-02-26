import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  test: {
    globals: true,
    collectCoverageFrom: ["src/ui/**/*.jsx", "src/**/*.js"],
    setupFiles: "src/spec/setupTests.js",
    testMatch: ["./src/spec/**/*.spec.jsx"],
    environment: "jsdom",
    coverage: {
      all: true,
      exclude: ["*.config.js", "*.cjs", "./src/ui/main.jsx", "*.json"],
    },
  },
  plugins: [react(), viteSingleFile()],
});
