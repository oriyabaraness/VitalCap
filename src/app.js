import { randomUUID } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_JSON_BYTES = 1_048_576;
const DEFAULT_PUBLIC_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../public");

export function createApp({ config = {}, logger = console, now = () => new Date() } = {}) {
  const startedAt = now();
  const publicDir = resolve(config.publicDir || DEFAULT_PUBLIC_DIR);
  const service = {
    name: config.serviceName || "vitalcap-server",
    version: config.serviceVersion || "0.1.0",
    environment: config.nodeEnv || "development"
  };

  return createServer(async (req, res) => {
    const requestId = getRequestId(req);
    const started = process.hrtime.bigint();
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    res.setHeader("X-Request-Id", requestId);
    res.setHeader("X-Content-Type-Options", "nosniff");

    const corsHeaders = buildCorsHeaders(config.corsOrigin);
    for (const [header, value] of Object.entries(corsHeaders)) {
      res.setHeader(header, value);
    }

    res.on("finish", () => {
      const durationMs = Number(process.hrtime.bigint() - started) / 1_000_000;
      logger.info?.(
        `${req.method} ${url.pathname} ${res.statusCode} ${durationMs.toFixed(1)}ms request_id=${requestId}`
      );
    });

    try {
      if (req.method === "OPTIONS") {
        return sendNoContent(res, 204, {
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,X-Request-Id"
        });
      }

      if (req.method === "GET" && url.pathname === "/healthz") {
        return sendJson(res, 200, {
          status: "ok",
          service: service.name,
          timestamp: now().toISOString(),
          uptimeSeconds: getUptimeSeconds(startedAt, now())
        });
      }

      if (req.method === "GET" && url.pathname === "/api/status") {
        return sendJson(res, 200, {
          service,
          startedAt: startedAt.toISOString(),
          nodeVersion: process.version,
          uptimeSeconds: getUptimeSeconds(startedAt, now())
        });
      }

      if (req.method === "POST" && url.pathname === "/api/echo") {
        assertJsonRequest(req);
        return sendJson(res, 200, {
          data: await readJsonBody(req),
          requestId
        });
      }

      if ((req.method === "GET" || req.method === "HEAD") && (await serveStatic(req, res, url, publicDir))) {
        return;
      }

      return sendJson(res, 404, {
        error: {
          code: "not_found",
          message: `No route for ${req.method} ${url.pathname}`
        }
      });
    } catch (error) {
      return sendHttpError(res, error, logger);
    }
  });
}

async function serveStatic(req, res, url, publicDir) {
  const filePath = resolvePublicPath(publicDir, url.pathname);

  if (!filePath) {
    return false;
  }

  try {
    const fileStat = await stat(filePath);

    if (!fileStat.isFile()) {
      return false;
    }

    const body = await readFile(filePath);
    const headers = {
      "Content-Type": getMimeType(filePath),
      "Cache-Control": getStaticCacheControl(filePath),
      "Content-Length": body.length
    };

    res.writeHead(200, headers);

    if (req.method === "HEAD") {
      return res.end();
    }

    res.end(body);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT" || error?.code === "ENOTDIR") {
      return false;
    }

    throw error;
  }
}

function resolvePublicPath(publicDir, pathname) {
  const decodedPathname = decodeURIComponent(pathname);
  const publicPathname = decodedPathname === "/" ? "/index.html" : decodedPathname;
  const filePath = resolve(publicDir, `.${publicPathname}`);

  if (filePath !== publicDir && !filePath.startsWith(`${publicDir}${sep}`)) {
    return null;
  }

  return filePath;
}

function getMimeType(filePath) {
  const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".webp": "image/webp"
  };

  return mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream";
}

function getStaticCacheControl(filePath) {
  if ([".css", ".html", ".js"].includes(extname(filePath).toLowerCase())) {
    return "no-store";
  }

  return "public, max-age=3600";
}

class HttpError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

function assertJsonRequest(req) {
  const contentType = req.headers["content-type"] || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    throw new HttpError(415, "unsupported_media_type", "Content-Type must be application/json");
  }
}

async function readJsonBody(req) {
  const body = await readRequestBody(req, MAX_JSON_BYTES);

  if (body.trim() === "") {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new HttpError(400, "invalid_json", "Request body must be valid JSON");
  }
}

async function readRequestBody(req, maxBytes) {
  let body = "";
  let bytes = 0;

  for await (const chunk of req) {
    bytes += chunk.length;

    if (bytes > maxBytes) {
      throw new HttpError(413, "payload_too_large", "Request body is too large");
    }

    body += chunk;
  }

  return body;
}

function sendHttpError(res, error, logger) {
  if (error instanceof HttpError) {
    return sendJson(res, error.statusCode, {
      error: {
        code: error.code,
        message: error.message
      }
    });
  }

  logger.error?.(error);

  return sendJson(res, 500, {
    error: {
      code: "internal_server_error",
      message: "Unexpected server error"
    }
  });
}

function sendJson(res, statusCode, body, headers = {}) {
  const payload = JSON.stringify(body);

  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(payload),
    ...headers
  });
  res.end(payload);
}

function sendNoContent(res, statusCode, headers = {}) {
  res.writeHead(statusCode, headers);
  res.end();
}

function buildCorsHeaders(origin) {
  if (!origin) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Vary": "Origin"
  };
}

function getRequestId(req) {
  const header = req.headers["x-request-id"];

  if (Array.isArray(header)) {
    return header[0] || randomUUID();
  }

  return header || randomUUID();
}

function getUptimeSeconds(startedAt, currentTime) {
  return Math.round((currentTime.getTime() - startedAt.getTime()) / 1000);
}
