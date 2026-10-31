---
title: DNS settings
description: 3m-ui · DNS control for the panel's Mihomo core
---

# DNS settings

**DNS settings** control the DNS behaviour of the **panel's Mihomo core**. They
live under **Config → General settings → DNS settings**.

They affect the Mihomo process on this host only and are never written into
client subscriptions.

## Saving and applying

1. Click **Save general settings** (persisted by the panel);
2. Click **Generate & apply** so the core reloads.

Saving alone does not change the running core — the page reminds you to generate,
validate and apply after a successful save.

## DNS is off by default (read this on upgrade)

**DNS is disabled by default.** On a fresh install the switch is off and the
generated configuration contains `dns: {enable: false}`.

- Before this feature existed, the DNS section came from the default template
  (enabled, `fake-ip`, built-in resolvers);
- Now DNS follows these settings, and the default is off;
- If you had already saved DNS in the panel, that saved value is still used — it
  is not switched off behind your back.

Enable it manually if you rely on `fake-ip`, `nameserver-policy`, `fallback` or
`respect-rules` — for example domain-based routing or per-domain resolvers. WARP
domain or global routing is unaffected; see "How it interacts with other
configuration" below.

The values shown the first time you open the form are: off, `fake-ip`,
`0.0.0.0:1053`, `119.29.29.29` and `223.5.5.5`. Anything you leave empty falls
back to the core default.

## Fields

### Basic

| Field | YAML key | Values |
|-------|----------|--------|
| Enable DNS | `enable` | on / off |
| Listen address | `listen` | `host:port`, e.g. `0.0.0.0:1053`; empty = core default |
| Enhanced mode | `enhanced-mode` | `redir-host` / `fake-ip` |
| Resolve IPv6 (AAAA) | `ipv6` | enabled / disabled / core default |
| Cache algorithm | `cache-algorithm` | `lru` / `arc` |
| Prefer HTTP/3 for DoH | `prefer-h3` | enabled / disabled / core default |
| Use hosts from config | `use-hosts` | enabled / disabled / core default |
| Use system hosts | `use-system-hosts` | enabled / disabled / core default |
| Respect rules | `respect-rules` | enabled / disabled / core default |

### Resolvers (one per line)

| Field | YAML key | Notes |
|-------|----------|-------|
| Default nameserver | `default-nameserver` | Use IP addresses; resolves DNS server hostnames; encrypted DNS supported |
| Nameserver | `nameserver` | UDP, TCP, DoT, DoH, DoQ, `system`, `DHCP`; keep `#proxy` / `&params` inside the address |
| Fallback | `fallback` | Used together with fallback filtering |
| Proxy server nameserver | `proxy-server-nameserver` | Resolves proxy node hostnames; required when `respect-rules` is on |
| Direct nameserver | `direct-nameserver` | Resolvers for direct egress |
| Direct nameserver follows policy | `direct-nameserver-follow-policy` | enabled / disabled / core default |

### Domain resolver policies

| Field | YAML key | Notes |
|-------|----------|-------|
| Nameserver policy | `nameserver-policy` | domain / `geosite:` / `rule-set:` → resolvers (a list is allowed) |
| Proxy server nameserver policy | `proxy-server-nameserver-policy` | Requires `proxy-server-nameserver` |

### Fake-IP

| Field | YAML key | Values |
|-------|----------|--------|
| Fake-IP range | `fake-ip-range` | CIDR, e.g. `198.18.0.1/16` |
| Fake-IP range (IPv6) | `fake-ip-range6` | CIDR, e.g. `fdfe:dcba:9876::1/64` |
| Fake-IP filter mode | `fake-ip-filter-mode` | `blacklist` / `whitelist` / `rule` |
| Fake-IP filter | `fake-ip-filter` | One entry per line; in `rule` mode use rules such as `DOMAIN,example.com,real-ip` or `MATCH,fake-ip` |
| Fake-IP TTL (seconds) | `fake-ip-ttl` | Empty = core default |

### Fallback filtering

| Field | YAML key | Values |
|-------|----------|--------|
| GeoIP filtering | `fallback-filter.geoip` | enabled / disabled / core default |
| GeoIP code accepted | `fallback-filter.geoip-code` | e.g. `CN` |
| Filtered IP ranges | `fallback-filter.ipcidr` | One CIDR per line |
| Domains using fallback | `fallback-filter.domain` | One per line |
| Fallback geosite set | `fallback-filter.geosite` | Deprecated by Mihomo — prefer `nameserver-policy` |
| Lazy fallback query | `fallback-lazy-query` | enabled / disabled / core default |

## Validation

The backend validates on save and returns 400 naming the offending field:

- `enhanced-mode` ∈ `fake-ip` / `redir-host`; `cache-algorithm` ∈ `lru` / `arc`; `fake-ip-filter-mode` ∈ `blacklist` / `whitelist` / `rule`;
- `listen` must be `host:port` with a port between 1 and 65535;
- `fake-ip-range` / `fake-ip-range6` must be a valid CIDR of the matching IP version;
- every policy entry needs a domain plus a resolver (string or non-empty list);
- `respect-rules` requires `proxy-server-nameserver`;
- every `fallback-filter.ipcidr` entry must be a valid CIDR.

## How it interacts with other configuration

- **It overrides custom fragments.** Saved panel DNS wins over a `dns:` section in
  a custom fragment regardless of fragment order — hand-written DNS in a fragment
  is dropped silently. Move it here if it must apply to the server core.
- **WARP forces DNS on.** With WARP domain or global routing enabled, the generated
  configuration turns DNS on even when this switch is off.
- **It never reaches subscriptions.** Server DNS settings are not exported to client
  subscriptions; subscription DNS stays on the subscription side.

## Related

- Where server traffic goes: [Outbounds](./outbounds.md);
- Server rules and WARP: [Routing](./routing.md) and [WARP](./warp.md).
