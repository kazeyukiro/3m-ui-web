---
title: Tunnel health watchdog
description: 3m-ui · Tunnel health watchdog
---

# Tunnel health watchdog

The **tunnel health watchdog** restores connectivity when the tunnel is effectively down while the proxy process is still running. The panel issues an HTTP probe at a fixed interval; when consecutive failures reach a configured threshold, it restarts the Mihomo core. The feature is disabled by default and takes effect as soon as settings are saved, without a panel restart.

## Before enabling

Restarting the core disconnects every connected client and briefly interrupts proxy service while the core comes back up. The watchdog is therefore off by default and should only be enabled with a clear understanding of this impact on each restart. Choose a sufficiently large failure threshold so that a transient hiccup at the probe target does not trigger a restart.

## Settings

Configure under **Settings → System ops → Tunnel health watchdog**:

| Setting | Description | Default | Range |
|---------|-------------|---------|-------|
| Enable tunnel health monitor | Probe at the interval and restart the core after repeated failures | Off | — |
| Probe URL | Target that should be reachable while the tunnel is healthy | `https://www.cloudflare.com/cdn-cgi/trace` | Any valid HTTP(S) URL |
| Probe through proxy | Optional local inbound through which the probe is routed | Empty | `http` / `https` / `socks5` / `socks5h` proxy URL |
| Interval (s) | Seconds between probes | 30 | 1–86400 |
| Timeout (s) | Timeout per probe | 10 | 1–300 |
| Failures | Consecutive failures before a restart | 3 | 1–1000 |
| Cooldown (s) | Minimum seconds between two restarts | 300 | 1–86400 |

Values outside the allowed range fall back to the defaults. A blank probe URL also falls back to the default.

## Probe criteria

- Each probe is an HTTP GET request. A response with a status code below 500 counts as success. Codes 400–499 are still treated as a healthy tunnel — a changed probe path should not be read as a dead tunnel — while 500 and above count as failure.
- Network errors, TLS errors and timeouts all count as failures.
- The probe is routed through the optional proxy URL. Only the four schemes listed above are supported; any other scheme causes the probe to fail.
- A successful probe clears the consecutive failure counter.

## Restart behavior

- Probing and restarting occur only while the core is running. When the core has been stopped manually, the monitor neither probes it nor starts it.
- A restart is triggered once consecutive failures reach the threshold. The restart goes through the core service's standard entry point and respects all existing constraints: the core-update busy guard, configuration validation and lifecycle serialization.
- After a successful restart a cooldown period begins; further failures during the cooldown do not trigger another restart, preventing a restart loop.
- The consecutive failure counter is reset whenever settings change, so adjusting the threshold alone does not immediately cause a restart.

## Status and manual probe

The card displays the time of the last probe and last restart, the consecutive failure count and the total restart count. **Test probe** runs a single probe and reports success or failure along with elapsed time. A manual test neither triggers a restart nor requires the core to be running, so it can be used to verify the URL and proxy configuration before enabling the monitor.

Status fields:

| Field | Meaning |
|-------|---------|
| `enabled` | Whether the monitor is enabled |
| `interval` | Current probe interval (seconds) |
| `consecutive_failures` | Current consecutive failure count |
| `total_restarts` | Total number of restarts |
| `last_probe` | Time of the last probe (RFC 3339) |
| `last_restart` | Time of the last restart (RFC 3339) |
| `last_error` | Error message from the last probe or restart |

## API

Settings are stored as JSON under the `tunnel_health` key in the database and read and written through dedicated endpoints; saving applies them to the running monitor immediately.

```bash
# Read settings
curl -H "Authorization: Bearer <token>" \
  https://panel.example.com/api/v1/tunnel-health/settings

# Save settings
curl -X PUT -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"enabled":true,"url":"https://www.cloudflare.com/cdn-cgi/trace","proxy_url":"","interval":30,"timeout":10,"failures":3,"cooldown":300}' \
  https://panel.example.com/api/v1/tunnel-health/settings

# Read live status
curl -H "Authorization: Bearer <token>" \
  https://panel.example.com/api/v1/tunnel-health/status

# Run a manual probe (the request body may specify the URL, proxy and other parameters)
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"url":"https://www.cloudflare.com/cdn-cgi/trace"}' \
  https://panel.example.com/api/v1/tunnel-health/test
```

## See also

- [System settings](./system-settings)
- [Core overview](./core)
