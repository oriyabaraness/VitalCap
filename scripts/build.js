import { cp, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = resolve(root, "dist");

await rm(outputDir, { recursive: true, force: true });
await cp(resolve(root, "public"), outputDir, { recursive: true });

console.log(`Built VitalCap static site at ${outputDir}`);
