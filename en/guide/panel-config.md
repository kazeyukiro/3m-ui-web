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
| **General** | `inbound-tfo` / `inbound-mptcp` | Global; **server** inbound listeners only |
| **Proxy entry** | `tfo` / `mptcp` | Per outbound/node; included in **client subscriptions** |

TCP only. API: `GET/POST /api/v1/config/visual`.

## Same port for TCP and UDP

Listeners may share the **same port** for TCP and UDP (also allowed at config generate time).

