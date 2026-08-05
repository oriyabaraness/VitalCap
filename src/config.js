const DEFAULT_PORT = 3000;

export function loadConfig(env = process.env) {
  return {
    host: env.HOST || "0.0.0.0",
    port: parsePort(env.PORT, DEFAULT_PORT),
    nodeEnv: env.NODE_ENV || "development",
    serviceName: env.SERVICE_NAME || "vitalcap-server",
    serviceVersion: env.SERVICE_VERSION || "0.1.0",
    corsOrigin: env.CORS_ORIGIN || ""
  };
}

function parsePort(value, fallback) {
  if (value === undefined || value === "") {
    return fallback;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`PORT must be an integer between 0 and 65535. Received: ${value}`);
  }

  return port;
}
