---
title: API & auth
description: 3m-ui · API & auth
---

# API 与鉴权

## API and authentication

HTTP API is under `/api/v1`. Login returns a JWT Bearer token. Protected routes require `Authorization: Bearer <token>`.

When `must_change_password` is set, only password change and limited auth routes are allowed until the password is updated.

### OpenAPI

Machine-readable spec: `GET /api/v1/openapi.yaml` (JWT required on most installs).

### Listeners and users — async core apply

Creating, updating, or deleting a listener returns after the panel database write. Mihomo `ApplyConfig` runs in the background (debounced ~400ms). User create/update that changes credentials uses the same pattern. A `201`/`200` does not mean the core has finished reloading. For a synchronous reload use the node reload / core restart endpoints documented in OpenAPI.

One-click listener create: `POST /api/v1/nodes/quick` with JSON `{"name":"...","protocol":"vless"}` (alias `/listeners/quick`).

### Dashboard process usage

`GET /api/v1/dashboard` includes host metrics plus per-process samples:

- `panel` — 3m-ui process (`pid`, `cpu_percent`, `memory_used` RSS bytes, `memory_percent`)

- `core` — managed Mihomo process (same fields; zeros when the core is stopped)

CPU is a short delta (first sample after a gap may be near 0). Full OpenAPI: `GET /api/v1/openapi.yaml`.

