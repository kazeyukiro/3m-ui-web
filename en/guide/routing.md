---
title: Routing
description: 3m-ui · Client subscription and server egress
---

# Routing

The **Routing** page has two scopes:

| Tab | Stored as | Affects |
|-----|-----------|---------|
| **Client subscription** | `visual-config` | Mihomo/Clash **subscription** YAML (`proxy-groups` / `rules`) only |
| **Server egress** | `server-routing` | **Panel Mihomo process** after traffic hits listeners (for panel Mihomo egress) |

## Client subscription

- Community templates (YiXuanZX / echs-top / AIsouler) fill groups + rules for the **client** YAML. Switching a template **replaces** rules and groups (does not only append).
- After save, **update the subscription in the client**.
- These rules are **not** merged into the serving `config.yaml`.

GEOSITE/GEOIP templates need MetaCubeX geodata — update under **Settings → Geo**.

## Server egress

No community templates on this tab. Use **WARP domains** (after registering WARP in Settings) plus custom rules. Default remains `MATCH,DIRECT`.

## Server egress detail

Controls how traffic **leaves the VPS** after a user connects to a node.

- Default: `MATCH,DIRECT` (historical behaviour — all egress direct from the host).
- You can add Mihomo rules and optional `proxies` / `proxy-groups` (e.g. a WARP outbound from Settings).
- **Save → Generate & apply** so the core reloads.
- API: `GET/PUT /api/v1/config/server-routing`  
  body example: `{ "proxies": [], "proxyGroups": [], "rules": ["MATCH,DIRECT"], "warpDomains": [] }`
- If no `MATCH,...` line is present, the panel appends `MATCH,DIRECT`.

## Config engine

**Generate & apply** rebuilds listeners and applies **server egress** into the serving config. Client community rules stay subscription-only.

Cloudflare WARP registration is under **Settings**. See [WARP](./warp.md).
