---
title: Panel config
description: 3m-ui · Panel config
---

# Panel config

## Panel configuration

Main config file: `/etc/3m-ui/config.yaml`. Data directory defaults to `/var/lib/3m-ui`.

Change the listen port with `3m-ui` menu item “Change panel port”, or edit config and restart the service.

## Hidden panel path (web_path)

To reduce the chance of the panel being discovered by internet-wide scans, on first install the panel **auto-generates a random URL path prefix** (e.g. `/0ae9800469b5635b911a5b94ac616e22`) and writes it to `server.web_path` in `/etc/3m-ui/config.yaml`.

- The panel UI and API are only reachable under that random path, e.g. `https://panel.example.com/<random>/`
- The bare domain (`https://panel.example.com/`) always returns **404** and does not reveal the panel
- Public endpoints such as client subscriptions `/api/v1/client/...`, health checks `/api/v1/health` and `/healthz` remain reachable on the bare domain by design

**View the path**: the management command prints the full access URL (IP, port and random path):

```bash
3m-ui status        # Panel URL: http://<server-ip>:8080/<random>/
3m-ui config show   # full config, including server.web_path
```

The installer prints that same `Panel URL` line when it finishes, so you can open the panel straight from it.

**Change the path**: edit the config and restart.

```bash
# Change to a custom path (e.g. /secret), or set "" to serve from the domain root
# server:
#   web_path: "/secret"
systemctl restart 3m-ui
```

The environment variable `THREE_M_UI_WEB_PATH` (short `WEB_PATH`) overrides the config value; set it to an empty string to serve from the root.

> Note: when proxying through nginx, proxy to the panel listen address (e.g. `http://127.0.0.1:8080`). The panel handles the random path prefix itself — you do not hard-code the prefix in nginx.

## TFO / MPTCP in the config engine

On the **Config** page:

| Where | Mihomo keys | Scope |
|-------|-------------|--------|
| **General** | `inbound-tfo` / `inbound-mptcp` | Server Mihomo inbounds only; **not** written into client subscriptions |
| **Proxy entry** | `tfo` / `mptcp` | Client outbound flags ([Mihomo docs](https://wiki.metacubex.one/config/proxies/#tfo)); booleans — not `inbound-*` |

**Mode** is not edited in General settings. TCP only. API: `GET/POST /api/v1/config/visual`.

## Same port for TCP and UDP

Listeners may share the **same port** for TCP and UDP (also allowed at config generate time).

