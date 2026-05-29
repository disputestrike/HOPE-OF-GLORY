import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(here, "apps/web/src"),
      "@hog/shared": resolve(here, "packages/shared/index.ts"),
      "@hog/safety": resolve(here, "packages/safety/index.ts"),
      "@hog/db": resolve(here, "packages/db/index.ts"),
      "@hog/ai": resolve(here, "packages/ai/index.ts"),
    },
  },
});

