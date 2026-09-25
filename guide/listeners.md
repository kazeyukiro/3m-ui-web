---
title: 节点（Listeners）
description: 3m-ui · 节点（Listeners）
---

# 节点（Listeners）

## Listeners (nodes)

Create inbound listeners from the panel. Supported protocols follow the Mihomo listener model (VLESS, VMess, Trojan, Shadowsocks, Hysteria2, TUIC, and more).

### One-click create

Use **Quick create** when you only need a protocol and a name. The panel allocates a free port and fills credentials / REALITY–TLS defaults. Full form create is still available for advanced fields.

### How saves work

Create / update / delete write the panel database first and return success immediately. Mihomo config application is **debounced in the background** (about 400ms), same idea as user credential sync. A successful UI response does not mean the core has finished reloading yet — wait a moment, then use runtime status / connectivity checks. Activation failures are logged and do not roll back the panel record; fix the config and reload if needed.

API: `POST /api/v1/nodes`, `POST /api/v1/nodes/quick` (aliases under `/listeners`). OpenAPI: `GET /api/v1/openapi.yaml`.

### Traffic multiplier

Field `traffic_multiplier` (default 1): raw traffic on this node × multiplier counts toward each user’s quota. Configure in the node form.

### Batch certificate

Select multiple nodes and apply one TLS certificate (PEM body, allowlisted file paths such as Let's Encrypt, or reuse panel SSL). API: `POST /api/v1/nodes/batch/certificate`.
