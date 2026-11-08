---
title: Share
description: 3m-ui · Share
---

# Share

The Share page works per user: after selecting a user it offers two tabs, `?tab=sub` (subscription) and `?tab=uri` (per-node URI). The selection is written to `?user=<id>`, so a link can open it directly.

## Subscription tab

Lists that user's subscription links, each copyable or renderable as a QR code: `Mihomo / Clash YAML`, `V2Ray / Base64`, `Sing-box JSON`, `Loon`, `Surge`, `Quantumult X`, plus the `?html=1` subscription info page.

The format is selected by `?target=`; without `target` the `User-Agent` decides (Clash/Mihomo → YAML, v2rayNG → Base64, sing-box → JSON, Loon/Surge/Quantumult X → their native formats). Response headers carry traffic and expiry info (`Subscription-Userinfo`).

## URI tab

Expands the nodes bound to that user and calls `GET /api/v1/nodes/{id}/uri` on demand for share URIs (the first URI gets a QR code). With no bound nodes it prompts you to bind Listeners on the Users page first. `GET /api/v1/users/{id}/nodes` supplies the bound list.

## Other actions

- **Export all subscription links**: `GET /api/v1/users/export-links` copies `username / group / subscription` as TSV to the clipboard
- **Refresh list** and **rotate subscription token**: `POST /api/v1/users/{id}/subscription/rotate`

Share links and URIs contain credentials and are equivalent to account secrets — do not publish them.
