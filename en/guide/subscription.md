---
title: Subscriptions
description: 3m-ui · Subscriptions
---

# Subscriptions

Each user has a subscription token URL under `/api/v1/client/sub/<token>`.

- Default / Clash Meta: Mihomo client YAML
- `?target=v2ray` / `base64`: **always** Base64 of share links (required by classic clients)
- `?target=singbox`: sing-box JSON
- `?target=loon` / `surge` / `quanx`: native Loon / Surge / Quantumult X configs (no subconverter needed; unsupported protocols are emitted as comment lines)

Without `?target=`, the format is picked from the client's User-Agent. The full target list, UA detection rules and the protocol matrix for the three Apple clients are documented under [Subscription formats & target](./subscription-formats).

`sub_pull_limit` is enforced on the user subscription path (see [Users & traffic](./users-traffic)). TUIC/Hysteria2 share links include client TLS params.
