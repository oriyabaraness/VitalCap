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
await writeFile(
  resolve(serverDir, "index.js"),
  `import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { createApp } from "./app.js";
import { loadConfig } from "./config.js";

const publicDir = [
  process.env.PUBLIC_DIR,
  resolve(process.cwd(), "dist/public"),
  resolve(process.cwd(), "public")
].filter(Boolean).find((candidate) => existsSync(candidate));

const config = {
  ...loadConfig(),
  publicDir: publicDir || resolve(process.cwd(), "public")
};

const server = createApp({ config });

server.on("error", (error) => {
  console.error("Server failed to start", error);
  process.exit(1);
});

server.listen(config.port, config.host, () => {
  console.log(\`\${config.serviceName} listening on http://\${config.host}:\${config.port}\`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => shutdown(signal));
}

function shutdown(signal) {
  console.log(\`\${signal} received, closing server\`);

  server.close((error) => {
    if (error) {
      console.error("Server shutdown failed", error);
      process.exit(1);
    }

    process.exit(0);
  });

  setTimeout(() => {
    console.error("Server shutdown timed out");
    process.exit(1);
  }, 10_000).unref();
}
`
);
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
