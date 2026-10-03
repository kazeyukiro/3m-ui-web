---
title: Panel SSL / ACME
---

# Panel SSL / ACME

Configure HTTPS for the 3m-ui panel process.

## HTTP-01

Requires the chosen domain to point at this host and port **80** open for the challenge. Issue or renew from **System / SSL** in the UI.

## DNS-01

Use when HTTP-01 is impossible or you need a **wildcard** certificate. Configure the DNS provider token in panel settings, then request the certificate from the same SSL page.

## Operations

- Certificates are stored under the panel data directory; include them in backups.
- Changing domain or `web_path` may require re-issuing and updating reverse proxies.
- Node (listener) certificates are managed separately — see [Batch certificates](./batch-certificate) and per-node TLS settings.
