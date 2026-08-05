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
await writeFile(
  resolve(serverDir, "index.js"),
  `const MAX_JSON_BYTES = 1_048_576;
const startedAt = new Date();

export default {
  fetch: handleRequest
};

export { handleRequest as fetch };

async function handleRequest(request, env = {}) {
  const requestId = getRequestId(request);
  const url = new URL(request.url);
  const baseHeaders = {
    "X-Request-Id": requestId,
    "X-Content-Type-Options": "nosniff",
    ...buildCorsHeaders(env.CORS_ORIGIN)
  };

  try {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...baseHeaders,
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,X-Request-Id"
        }
      });
    }

    if (request.method === "GET" && url.pathname === "/healthz") {
      return sendJson(200, {
        status: "ok",
        service: env.SERVICE_NAME || "vitalcap-server",
        timestamp: new Date().toISOString(),
        uptimeSeconds: getUptimeSeconds()
      }, baseHeaders);
    }

    if (request.method === "GET" && url.pathname === "/api/status") {
      return sendJson(200, {
        service: {
          name: env.SERVICE_NAME || "vitalcap-server",
          version: env.SERVICE_VERSION || "0.1.0",
          environment: env.NODE_ENV || "production"
        },
        startedAt: startedAt.toISOString(),
        nodeVersion: globalThis.process?.version || "edge-runtime",
        uptimeSeconds: getUptimeSeconds()
      }, baseHeaders);
    }

    if (request.method === "POST" && url.pathname === "/api/echo") {
      assertJsonRequest(request);
      return sendJson(200, {
        data: await readJsonBody(request),
        requestId
      }, baseHeaders);
    }

    const assetResponse = await serveAsset(request, env, url);

    if (assetResponse) {
      return withHeaders(assetResponse, baseHeaders);
    }

    return sendJson(404, {
      error: {
        code: "not_found",
        message: "No route for " + request.method + " " + url.pathname
      }
    }, baseHeaders);
  } catch (error) {
    if (error instanceof HttpError) {
      return sendJson(error.statusCode, {
        error: {
          code: error.code,
          message: error.message
        }
      }, baseHeaders);
    }

    console.error(error);
    return sendJson(500, {
      error: {
        code: "internal_server_error",
        message: "Unexpected server error"
      }
    }, baseHeaders);
  }
}

async function serveAsset(request, env, url) {
  if ((request.method !== "GET" && request.method !== "HEAD") || !env.ASSETS?.fetch) {
    return null;
  }

  const assetUrl = new URL(url);

  if (assetUrl.pathname === "/") {
    assetUrl.pathname = "/index.html";
  }

  const response = await env.ASSETS.fetch(new Request(assetUrl, request));
  return response.status === 404 ? null : response;
}

function assertJsonRequest(request) {
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    throw new HttpError(415, "unsupported_media_type", "Content-Type must be application/json");
  }
}

async function readJsonBody(request) {
  const body = await request.text();

  if (new TextEncoder().encode(body).byteLength > MAX_JSON_BYTES) {
    throw new HttpError(413, "payload_too_large", "Request body is too large");
  }

  if (body.trim() === "") {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new HttpError(400, "invalid_json", "Request body must be valid JSON");
  }
}

function sendJson(status, body, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function withHeaders(response, headers) {
  const mergedHeaders = new Headers(response.headers);

  for (const [header, value] of Object.entries(headers)) {
    mergedHeaders.set(header, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: mergedHeaders
  });
}

function buildCorsHeaders(origin) {
  return origin ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" } : {};
}

function getRequestId(request) {
  return request.headers.get("x-request-id") || globalThis.crypto?.randomUUID?.() || String(Math.random());
}

function getUptimeSeconds() {
  return Math.round((Date.now() - startedAt.getTime()) / 1000);
}

class HttpError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = code;
  }
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
