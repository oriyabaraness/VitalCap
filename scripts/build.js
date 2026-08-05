import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = resolve(root, "dist");
const serverDir = resolve(outputDir, "server");

await rm(outputDir, { recursive: true, force: true });
await mkdir(serverDir, { recursive: true });
await cp(resolve(root, "public"), resolve(outputDir, "public"), { recursive: true });
await cp(resolve(root, ".openai"), resolve(outputDir, ".openai"), { recursive: true });
await cp(resolve(root, "src/app.js"), resolve(serverDir, "app.js"));
await cp(resolve(root, "src/config.js"), resolve(serverDir, "config.js"));
await cp(resolve(root, "src/server.js"), resolve(serverDir, "index.js"));
await writeFile(
  resolve(outputDir, "package.json"),
  `${JSON.stringify(
    {
      type: "module",
      scripts: {
        start: "node server/index.js"
      }
    },
    null,
    2
  )}\n`
);

console.log(`Built VitalCap deploy bundle at ${outputDir}`);
