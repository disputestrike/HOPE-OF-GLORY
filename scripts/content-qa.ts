import { readFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();

const files = execFileSync("rg", [
  "--files",
  "src/app",
  "src/components",
  "src/data",
  "content/site-copy",
], { cwd: root, encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean)
  .filter((file) => /\.(tsx?|mdx?|json)$/.test(file))
  .filter((file) => !file.includes("/admin/") && !file.includes("\\admin\\"));

const banned = [
  /coming soon/i,
  /not connected in this preview/i,
  /paypal-placeholder/i,
  /lorem ipsum/i,
  /todo:\s*write/i,
];

const failures: string[] = [];

for (const file of files) {
  const text = readFileSync(join(root, file), "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const pattern of banned) {
      if (pattern.test(line)) {
        failures.push(`${file}:${index + 1} matches ${pattern}: ${line.trim()}`);
      }
    }
  });
}

if (failures.length > 0) {
  console.error("Content QA failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Content QA passed across ${files.length} files.`);

