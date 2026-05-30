/**
 * Content QA — scans public-facing content for banned placeholder copy that
 * would betray "not yet live" if it slipped to production. Used as a release
 * gate by .github/workflows/pre-release.yml and the admin /admin/release page.
 *
 * Replaced the previous ripgrep dependency with a Node-native walker so it
 * runs in any CI environment without external tooling.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const scanRoots = [
  "src/app",
  "src/components",
  "src/data",
  "content/site-copy",
];
const extensions = /\.(tsx?|mdx?|json)$/;

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    const rel = relative(root, full).replace(/\\/g, "/");
    if (rel.includes("/admin/") || rel.startsWith("admin/")) continue;
    if (rel.includes("/node_modules/") || rel.includes("/.next/")) continue;
    let info;
    try {
      info = statSync(full);
    } catch {
      continue;
    }
    if (info.isDirectory()) {
      walk(full, out);
    } else if (extensions.test(entry)) {
      out.push(rel);
    }
  }
  return out;
}

const files: string[] = [];
for (const r of scanRoots) {
  walk(join(root, r), files);
}

const banned: ReadonlyArray<RegExp> = [
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
