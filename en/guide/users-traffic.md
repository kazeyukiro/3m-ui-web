---
title: Users & traffic
description: 3m-ui · Users & traffic
---

# Users & traffic

### Quick create

Users page → **Quick create**: username may be empty (auto-generated), password and UUID are generated, optional bind-all local nodes. Plain credentials appear **once** in a dialog.

API: `POST /api/v1/users/quick` with body `{ "username"?: string, "bind_all_listeners"?: boolean, "remark"?: string }`. Response includes `{ user, password, uuid }`. Full create remains `POST /api/v1/users`. OpenAPI: `GET /api/v1/openapi.yaml`.

### Traffic and limits

- Total traffic quota, expiry, IP limit, subscription pull limit, and related fields
- **Per-node accounting** applies each node’s traffic multiplier when billing
- Online status comes from core connections; brief offline during reload is normal

### Limit fields

| Field | Meaning |
|-------|---------|
| `ip_limit` | `0` = unlimited concurrent source IPs. When set, the panel polls Mihomo connections about every **5 seconds** and closes excess IPs (not blocked at handshake). |
| `sub_pull_limit` | `0` = unlimited. Max successful subscription downloads per **rolling 24 hours**; over limit returns **429**. |

### Per-node traffic & multiplier

Each node has a **traffic multiplier** (default 1). Raw bytes on that node × multiplier are added to the user’s quota (`traffic_used`).

Users page → node-traffic action shows per-node raw and billed usage. API: `GET /api/v1/users/{id}/node-traffic`.

### User fields (summary)

| Field | Notes |
|-------|--------|
| Username | Unique; after hard-delete the name can be reused |
| Remark | Display name / subscription title fallback |
| Enabled | When off, auth and subscription fail |
| Traffic limit | Bytes; `0` = unlimited |
| Traffic used | Cumulative up/down (after multipliers where applicable) |
| Expiry | Optional; related cycle/renew fields as in the current UI |

Device and security-related options follow the fields shown in the current panel build; if something was removed or renamed, prefer the Release notes.
