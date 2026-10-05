---
title: Panel config
description: 3m-ui · Panel config
---

# Panel config

## Panel configuration

Main config file: `/etc/3m-ui/config.yaml`. Data directory defaults to `/var/lib/3m-ui`.

Change the listen port with `3m-ui` menu item “Change panel port”, or edit config and restart the service.

## TFO / MPTCP in the config engine

On the **Config** page:

| Where | Mihomo keys | Scope |
|-------|-------------|--------|
| **General** | `inbound-tfo` / `inbound-mptcp` | Server Mihomo inbounds only; **not** written into client subscriptions |
| **Proxy entry** | `tfo` / `mptcp` | Client outbound flags ([Mihomo docs](https://wiki.metacubex.one/config/proxies/#tfo)); booleans — not `inbound-*` |

**Mode** is not edited in General settings. TCP only. API: `GET/POST /api/v1/config/visual`.

## Same port for TCP and UDP

Listeners may share the **same port** for TCP and UDP (also allowed at config generate time).

