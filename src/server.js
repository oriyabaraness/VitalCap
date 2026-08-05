import { createApp } from "./app.js";
import { loadConfig } from "./config.js";

const config = loadConfig();
const server = createApp({ config });

server.on("error", (error) => {
  console.error("Server failed to start", error);
  process.exit(1);
});

server.listen(config.port, config.host, () => {
  console.log(`${config.serviceName} listening on http://${config.host}:${config.port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => shutdown(signal));
}

function shutdown(signal) {
  console.log(`${signal} received, closing server`);

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
