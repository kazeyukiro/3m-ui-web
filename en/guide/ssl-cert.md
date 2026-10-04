---
title: Panel SSL / ACME
---

# Panel SSL / ACME

Configure HTTPS for the 3m-ui panel process.

## Modes

| Mode | When to use |
|------|-------------|
| **HTTP-01** | Single domain; public port **80** reachable |
| **DNS-01** | Wildcard or no port 80 (Cloudflare API token) |
| **IP certificate** | Public IP in the domain field (short-lived) |
| **Manual PEM** | Paths to fullchain / privkey |

## Auto-renewal

Runs inside the panel process (about every **6 hours**). No crontab required.

| Certificate | Renews when |
|-------------|-------------|
| Domain **HTTP-01** / **DNS-01** | Fewer than **15 days** remain until expiry |
| **IP certificate** | Fewer than **48 hours** remain (~6-day short-lived certs) |
| **Manual PEM** | Not auto-renewed |

Engine: **acmez**. HTTP-01 still needs port **80**; DNS-01 needs a valid API token.

## HTTP-01

Requires the chosen domain to point at this host and port **80** open for the challenge. Configure under **System → SSL**, then restart the panel if prompted.

## DNS-01

Use when HTTP-01 is impossible or you need a **wildcard** certificate. Configure the DNS provider token in panel settings, then request the certificate from the same SSL page.

## Operations

- Certificates are stored under the panel data directory; include them in backups.
- Changing domain or `web_path` may require re-issuing and updating reverse proxies.
- Node (listener) certificates are managed separately — see [Batch certificates](./batch-certificate) and per-node TLS settings.
