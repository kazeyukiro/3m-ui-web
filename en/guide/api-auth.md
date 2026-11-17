---
title: API & auth
description: 3m-ui · API & auth
---

# API & auth

## API & authentication

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

### Tunnel health watchdog

The tunnel health monitor exposes its settings, live status and manual probe through dedicated endpoints under `/api/v1/tunnel-health`; the machine-readable spec is in OpenAPI:

- `GET/PUT /api/v1/tunnel-health/settings` — read / save monitor settings; saving applies them to the running monitor immediately.
- `GET /api/v1/tunnel-health/status` — read the consecutive-failure count, cumulative restart count and the timestamps of the last probe, restart and error.
- `POST /api/v1/tunnel-health/test` — run one probe and report the result, without triggering a restart or requiring the core to be running.

For configuration details, probe criteria and restart behaviour, see [Tunnel health watchdog](./tunnel-health).


## GitHub OAuth

When enabled, `GET /api/v1/auth/oauth/github/start` redirects to GitHub; the callback issues the same JWT as password login (browser redirected to `/login?oauth_token=...`). Admin settings: `GET/PUT /api/v1/auth/oauth/github/settings`.
