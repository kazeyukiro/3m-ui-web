---
title: Batch apply node certificates
---

# Batch apply node certificates

Use **Nodes → batch certificate** to push one PEM certificate and private key to many Listeners that already use TLS (or TLS-native protocols such as TUIC / Hysteria2 / AnyTLS).

## Behaviour

- Only **selected** Listeners are updated; others are unchanged.
- The panel writes `certificate` / `private-key` into each listener's config JSON, and Mihomo reloads after you generate / validate / apply the config.
- On apply, the panel **completes the certificate chain** in the order "same-directory fullchain → same-directory ca/chain → AIA issuer"; see the "Certificate chain completion" section in [Panel SSL / ACME](./ssl-cert).
- Share links and subscriptions resolve SNI from this material. A formal certificate with a complete chain no longer needs `skip-cert-verify`; it is still set for self-signed certs, no certificate with an IP endpoint, Reality, or an explicit override.
- Protocols that do not support certificate mode (e.g. pure Reality) appear in `failed`.

## API

`POST /api/v1/nodes/batch/certificate` (admin JWT)

```json
{
  "ids": [1, 2, 3],
  "certificate": "-----BEGIN CERTIFICATE-----...",
  "private_key": "-----BEGIN PRIVATE KEY-----...",
  "cert_file": "/etc/letsencrypt/live/example.com/fullchain.pem",
  "key_file": "/etc/letsencrypt/live/example.com/privkey.pem",
  "from_panel_ssl": false
}
```

Provide exactly one of:

- PEM strings directly; or
- both certificate and private key **file paths** (allowed directories include `/etc/letsencrypt/`, `/var/lib/3m-ui/`); or
- `from_panel_ssl: true` (reuse the manual cert paths configured for panel SSL)

Response example: `{ "updated": [1, 2], "failed": [{ "id": 3, "name": "...", "error": "..." }] }`.

## Requirements

- Valid certificate + private key PEM, or paths the panel can read.
- Listeners must be TLS-capable; pure plaintext protocols are skipped.

## Relationship to panel SSL

Panel HTTPS is documented in [Panel SSL / ACME](./ssl-cert). Batch certificates target **node inbound** certificates; the two are independent, except that `from_panel_ssl: true` reuses the panel's manual cert paths.

## After apply

1. **Generate / validate / apply** config so the core reloads.
2. Refresh client subscriptions so URIs pick up the new SNI and certificate verification result.
