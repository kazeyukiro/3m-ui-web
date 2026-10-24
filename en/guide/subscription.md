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

## Subscription information page

Append `?html=1` to the subscription URL to open the **subscription information page**:

`https://<panel-domain>/api/v1/client/sub/<token>?html=1`

Opening the subscription link directly in a browser serves the client config (YAML / Base64) picked from the User-Agent instead of a web page; use `?html=1` (`?target=html` works too) when you want the page. `?format=info` returns the subscription metadata as JSON.

The page is a **mobile-first** single-page design: fully readable with JavaScript disabled, and interactive with JS enabled (language switch, copy toasts, notice expand/collapse, progress-bar animation):

| Section | Contents |
|---------|----------|
| Header | Page title, username, 中文 / English switch |
| Notices | Panel-managed announcement list; pinned notices render expanded |
| Import card | Subscription QR code — scan to import (Mihomo / Clash / sing-box / Shadowrocket, etc.) |
| One-tap import | **One-tap import Clash / Mihomo** — launches the client and adds the subscription |
| Quick row | **Sing-box** deep-link import, **Copy link** (subscription URL) |
| Account summary | Traffic bar, remaining traffic, expiry, upload / download, IP limit, days left |
| Nodes | Colored protocol badge, node name, protocol · security meta (e.g. `gRPC · TLS`), per-node copy, raw URI expand, copy all |

The page CSP is issued per response with sha256 hashes for its inline scripts — **no** `unsafe-inline` — so the single-file template (built-in or custom theme) keeps working.

### One-tap import (deep links)

| Button | Link shape | Clients |
|--------|-----------|---------|
| One-tap import Clash / Mihomo | `clash://install-config?url=<url-encoded subscription URL>` | Clash Meta, FlClash, Stash, … |
| Sing-box | `sing-box://import-remote?url=<url-encoded subscription URL>` | sing-box official client |

The deep links carry `?target=clash` / `?target=singbox` respectively, so the client fetches its native format. They are rendered as plain `<a href>` — tapping still works without JS (only the guiding toast is missing).

### Notice block

Maintained under **Settings → Subscription page → Notice block**, one notice per line:

```
[*]date|title|details
```

- Leading `*`: pinned, details expanded by default;
- The date may be omitted (`|title|details`);
- Lines starting with `#` are comments and never shown;
- Up to **20** notices; over-long titles / details are truncated by character.

The legacy single **Announcement** field still acts as a fallback: when the notice block is empty and the legacy field is set, that one notice is shown pinned. Migrate to the notice block and clear the legacy field afterwards.

### Subscription page settings

Items under **Settings → Subscription page** that affect the information page:

| Setting | Description |
|---------|-------------|
| Page title | Title shown in the page header |
| Support link | Technical-support link in the account summary (e.g. a Telegram agent) |
| Announcement | Single notice; fallback for the notice block |
| Notice block | Multi-notice editor, format above |
| Page template | Custom HTML template directory (`index.html` or `sub.html`); empty uses the built-in page |

### Custom templates

The built-in ViewModel is **append-only**: every existing field is preserved and the new page's fields (node name / protocol meta, notices, deep links, days left, …) are pure additions, so older custom templates keep rendering unchanged.
