---
title: Listener runtime status
---

# Listener runtime status

The Nodes page separates "enabled" from "actually reachable". The main badge reflects a connectivity check result (pass / fail / checking / untested / unknown / disabled). **A listening socket alone is not shown as usable**. Clicking a node opens diagnostics; a cached result is reused while still valid, otherwise a check runs against the exported client endpoints. Saving and enabling a node also triggers a check. The detail drawer distinguishes stages: socket observation, client config, test client start, authentication, and proxy access.

Lightweight socket polling only runs while the page is visible and **never** starts a test client. End-to-end results are cached in memory for about one minute and invalidated when the applied config, service process, or exported client config changes. Reading the cache re-exports the current config and verifies its hash (covering public endpoints and valid credentials; no credential-bearing YAML is stored in the cache). A failed request clears the display to unknown instead of leaving it green.

## API

Use the existing authenticated node/Listener routes:

- `GET /api/v1/nodes/runtime-status`: runtime status of all local nodes  
- `POST /api/v1/nodes/:id/check`: one fresh read-only check for a single node  
- `/api/v1/listeners` exposes the same aliases  

The list endpoint returns an array; a single check returns one object.  
`GET /api/v1/nodes/runtime-status?summary=true` performs the same socket inspection but returns an empty `endpoints` array, suitable for page polling; fetch full endpoints when opening the drawer or running a manual check. Omitting `summary=true` keeps the full list. A single check always returns full endpoints.

Full response example:

```json
{
  "id": 1,
  "state": "listening",
  "reason": "sockets_bound",
  "checked_at": "2026-01-01T00:00:00Z",
  "endpoints": []
}
```

## Common status meanings

| Status tendency | Meaning |
|----------|------|
| Enabled but unavailable | Config not applied, core not running, port conflict, or failed check |
| Applied but unknown | Panel cannot reach the core API or the check request failed |
| Check passed | Reachability verified via the exported client path (not just a listening port) |

## Troubleshooting

1. Confirm **Generate → Validate → Apply** has run  
2. Check core and panel logs for bind / TLS errors  
3. Verify public address, port, and certificate match the exported URI  
4. Re-run the check after credential changes to avoid stale cache  

Finer field and stage details follow the panel diagnostics drawer and API responses; the implementation evolves with the build, so prefer the current one.
