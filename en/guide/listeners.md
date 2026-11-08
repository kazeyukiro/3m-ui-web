---
title: Listeners
description: 3m-ui · Listeners
---

# Listeners

Create inbound listeners from the panel. The protocol model follows Mihomo's official `listeners` (VLESS, VMess, Trojan, Shadowsocks, Hysteria2, TUIC, and more).

## One-click create

Use **Quick create** when you only need **protocol + name** — the panel allocates a free port and fills credentials / REALITY–TLS defaults, producing usable defaults. Use the full edit form for fine-grained control.

## How saves work

Create / update / delete write the panel database first and return success immediately. Mihomo config application is **debounced in the background** (about 400ms), same idea as user credential sync. A successful UI response does not mean the core has finished reloading — wait a moment, then confirm with runtime status / connectivity checks. Activation failures are logged and do not roll back the panel record; fix the config and reload.

API: `POST /api/v1/nodes`, `POST /api/v1/nodes/quick` (aliases under `/listeners`). OpenAPI: `GET /api/v1/openapi.yaml`.

## Certificates

- Panel SSL: domain ACME, IP short-lived certificate, or manual PEM
- Nodes: self-sign, upload, or **apply one certificate to many nodes** (PEM body, allowlisted certificate file paths, or reuse panel SSL)

Batch certificate API: `POST /api/v1/nodes/batch/certificate`.

## Traffic multiplier

Field `traffic_multiplier` (default 1): raw traffic on this node × multiplier counts toward each user's quota. Configure it in the node form.

## Same-port TCP/UDP

TCP and UDP listeners may share the same port; config generation allows coexistence too.
