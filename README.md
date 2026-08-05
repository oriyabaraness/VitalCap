# VitalCap Server

A small Node.js server that serves the VitalCap website and HTTP API with no runtime dependencies.

## Requirements

- Node.js 20 or newer

## Run Locally

```sh
npm start
```

For development with file watching:

```sh
npm run dev
```

The server listens on `http://0.0.0.0:3000` by default and serves the site from `public/`.
Override settings with environment variables:

```sh
HOST=127.0.0.1 PORT=8080 npm start
```

## Endpoints

- `GET /` returns the VitalCap site.
- `GET /healthz` returns a lightweight health check.
- `GET /api/status` returns runtime status.
- `POST /api/echo` returns the JSON request body.

## Verify

```sh
npm run check
npm test
```

## Docker

```sh
docker build -t vitalcap-server .
docker run --rm -p 3000:3000 vitalcap-server
```
