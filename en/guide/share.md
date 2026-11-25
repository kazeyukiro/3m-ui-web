---
title: Share / Subscription
description: 3m-ui · Share / Subscription
---

# Share / Subscription

The Share page works per user: after selecting a user it offers two tabs, `?tab=sub` (subscription) and `?tab=uri` (per-node URI). The selection is written to `?user=<id>`, so a link can open it directly.

## Subscription tab

Lists that user's subscription links, each copyable or renderable as a QR code: `Mihomo / Clash YAML`, `V2Ray / Base64`, `Sing-box JSON`, `Loon`, `Surge`, `Quantumult X profile (import configuration)`, `Quantumult X nodes (add subscription)`, plus the `?html=1` subscription info page.

The two Quantumult X links point at different bodies from the same token: `?target=quanx` is a complete profile for "import configuration", while `?target=qx-nodes` carries node lines only for a remote resource in "add subscription". A complete profile is rejected as a node resource, and a node-only snippet imports without a policy group; they are not interchangeable.

The format is selected by `?target=`; without `target` the `User-Agent` decides (Clash/Mihomo → YAML, v2rayNG → Base64, sing-box → JSON, Loon/Surge/Quantumult X → their native formats, where Quantumult X receives the complete profile). Response headers carry traffic and expiry info (`Subscription-Userinfo`).

## URI tab

Expands the nodes bound to that user and calls `GET /api/v1/nodes/{id}/uri` on demand for share URIs (the first URI gets a QR code). With no bound nodes it prompts you to bind Listeners on the Users page first. `GET /api/v1/users/{id}/nodes` supplies the bound list.

## Other actions

- Export all subscription links: `GET /api/v1/users/export-links` copies `username / group / subscription` as TSV to the clipboard
- Refresh list and rotate subscription token: `POST /api/v1/users/{id}/subscription/rotate`

Share links and URIs contain credentials and are equivalent to account secrets — do not publish them.
