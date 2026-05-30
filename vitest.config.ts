import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", "dist/**"],
  },
  resolve: {
    alias: {
      "@": resolve(here, "src"),
      "@hog/ai": resolve(here, "src/lib/ai/index.ts"),
      "@hog/db": resolve(here, "src/lib/db/index.ts"),
      "@hog/email": resolve(here, "src/lib/email/index.ts"),
      "@hog/media": resolve(here, "src/lib/media/index.ts"),
      "@hog/prompts": resolve(here, "src/lib/prompts/index.ts"),
      "@hog/publishing": resolve(here, "src/lib/publishing/index.ts"),
      "@hog/rag": resolve(here, "src/lib/rag/index.ts"),
      "@hog/safety": resolve(here, "src/lib/safety/index.ts"),
      "@hog/scripture": resolve(here, "src/lib/scripture/index.ts"),
      "@hog/shared": resolve(here, "src/lib/shared/index.ts"),
    },
  },
});
