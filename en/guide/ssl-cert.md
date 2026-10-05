---
title: Panel SSL / ACME
---

# Panel SSL / ACME

Configure HTTPS for the 3m-ui **panel** process under **System → SSL / Certificates**. After saving, **restart the panel** so ListenTLS takes effect.

| Mode | When to use | Notes |
|------|-------------|--------|
| **HTTP-01** (default) | Single domain; public port **80** reachable | Standard Let's Encrypt |
| **DNS-01** | **Wildcard** `*.example.com`, or no port 80 | **Cloudflare** API token only (current build) |
| **IP certificate** | Public IP in the domain field | Short-lived LE cert; HTTP-01 / TLS-ALPN-01 |
| **Manual PEM** | Paths to fullchain / privkey | e.g. `/etc/letsencrypt/live/...` |

## Auto-renewal

Runs inside the panel process (about every **6 hours**). No crontab required.

| Certificate | Renews when |
|-------------|-------------|
| Domain **HTTP-01** / **DNS-01** | Fewer than **15 days** remain until expiry |
| **IP certificate** | Fewer than **48 hours** remain (~6-day short-lived certs) |
| **Manual PEM** | Not auto-renewed |

Engine: **acmez**. HTTP-01 still needs port **80**; DNS-01 needs a valid API token.

## Wildcard `*.example.com`

1. Set domain to `*.example.com` (or a normal domain and choose DNS-01)
2. Set ACME challenge to **DNS-01**
3. DNS provider: **Cloudflare**, with an API token that has **Zone → DNS → Edit**
4. Optional zone name `example.com` if auto-detection fails
5. Save and restart the panel; the cert includes `*.example.com` and apex `example.com`

Leaving the token empty on save keeps the previously stored token; the API never echoes the token.

## HTTP-01

Domain must point at this host and port **80** must be reachable for the challenge.

## DNS-01

Use when HTTP-01 is impossible or you need a **wildcard**. Only **Cloudflare** is supported in the current panel build.

## Rescue after a bad SSL config

```bash
3m-ui reset-config --panel --yes
systemctl restart 3m-ui
```

Or use the equivalent option in the SSH `3m-ui` menu. The panel comes back on plain HTTP so you can fix settings in the UI.

## Node certificates

Self-signed, uploaded path/PEM, or batch-apply to listeners. Optional reuse of panel manual cert paths (`from_panel_ssl`). See [Batch certificates](./batch-certificate).

## Operations

- Store cert material under the panel data directory and include it in backups.
- Changing domain or `web_path` may require re-issue and reverse-proxy updates.
