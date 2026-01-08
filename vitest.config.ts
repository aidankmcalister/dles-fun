import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
    // Exclude e2e or other non-unit test folders if necessary, but "whole place" is requested
    include: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    exclude: ["node_modules", ".next", ".agent"],
  },
});
