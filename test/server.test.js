import assert from "node:assert/strict";
import { test } from "node:test";

import { createApp } from "../src/app.js";

test("GET / serves the VitalCap site", async (t) => {
  const baseUrl = await startTestServer(t);
  const response = await fetch(`${baseUrl}/`);
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
  assert.match(body, /VitalCap/);
  assert.match(body, /lang="he" dir="rtl"/);
  assert.match(body, /תכנון רציפות עסקית מבוסס AI/);
  assert.match(body, /הריצו תרחיש רציפות של אפקט דומינו/);
  assert.match(body, /אפשרויות אפליקציה/);
  assert.match(body, /נתיב דומינו של תלויות/);
  assert.match(body, /ניטור איומים אזורי חי/);
});

test("GET static assets serves PDF-derived site images", async (t) => {
  const baseUrl = await startTestServer(t);
  const response = await fetch(`${baseUrl}/assets/risk-map.png`);
  const body = await response.arrayBuffer();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /image\/png/);
  assert.ok(body.byteLength > 1000);
});

test("GET /healthz returns healthy status", async (t) => {
  const baseUrl = await startTestServer(t);
  const response = await fetch(`${baseUrl}/healthz`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
  assert.equal(body.service, "vitalcap-server-test");
  assert.equal(typeof body.timestamp, "string");
  assert.equal(typeof body.uptimeSeconds, "number");
});

test("GET /api/status returns runtime metadata", async (t) => {
  const baseUrl = await startTestServer(t);
  const response = await fetch(`${baseUrl}/api/status`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.service.name, "vitalcap-server-test");
  assert.equal(body.service.version, "0.0.0-test");
  assert.equal(body.service.environment, "test");
  assert.equal(typeof body.nodeVersion, "string");
});

test("POST /api/echo returns parsed JSON and request id", async (t) => {
  const baseUrl = await startTestServer(t);
  const response = await fetch(`${baseUrl}/api/echo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Request-Id": "test-request-id"
    },
    body: JSON.stringify({ hello: "world" })
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body.data, { hello: "world" });
  assert.equal(body.requestId, "test-request-id");
});

test("POST /api/echo rejects invalid JSON", async (t) => {
  const baseUrl = await startTestServer(t);
  const response = await fetch(`${baseUrl}/api/echo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: "{bad json"
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error.code, "invalid_json");
});

test("unknown routes return 404 JSON errors", async (t) => {
  const baseUrl = await startTestServer(t);
  const response = await fetch(`${baseUrl}/missing`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.error.code, "not_found");
});

async function startTestServer(t) {
  const server = createApp({
    config: {
      serviceName: "vitalcap-server-test",
      serviceVersion: "0.0.0-test",
      nodeEnv: "test"
    },
    logger: silentLogger
  });

  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  t.after(() => {
    server.close();
  });

  const address = server.address();
  return `http://127.0.0.1:${address.port}`;
}

const silentLogger = {
  info() {},
  error() {}
};
