---
title: Panel SSL / ACME
---

# Panel SSL / ACME

Configure panel HTTPS under **System → SSL / Certificates**. After saving, **restart the panel** so ListenTLS takes effect. Panel HTTPS and node inbound certificates are two separate configurations; see the end of this page.

## Panel HTTPS

| Mode | When to use | Notes |
|------|-------------|-------|
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

## HTTP-01 and DNS-01

**HTTP-01**: the domain must point at this host and public port **80** must be reachable for the challenge.

**DNS-01**: use when port 80 is unavailable or a **wildcard** certificate is needed. Only **Cloudflare** is supported in the current panel build.

## Certificate chain completion

Browsers and iOS fetch missing intermediates from the leaf's **AIA** extension, so a panel that serves only the leaf looks fine in a browser. **Node.js (Mihomo Party), Go and Dart (FlClash)** do not, and fail with `unable to verify the first certificate` / `x509: certificate signed by unknown authority` when downloading a subscription. Let's Encrypt's short-lived IP certificates use the Gen Y hierarchy (leaf + YE1/YR1 + cross-signed roots); missing any link breaks verification.

The panel completes the chain when loading a certificate, so clients do not have to fall back to `skip-cert-verify`:

| Order | Source | Requirement |
|-------|--------|-------------|
| ① | `fullchain.cer` / `.pem` / `.crt` / `fullchain` in the certificate directory or under `~/.acme.sh/*/` | The first certificate must be the exact same leaf |
| ② | `ca.cer` / `ca.pem` / `ca.crt` / `chain.pem` / `chain.cer` / `chain.crt` in the same directory | Take the segment that links to the leaf |
| ③ | Issuer URL from the leaf's AIA extension | http/https only; the download must pass a signature check |

Every level verifies signatures link by link, so a wrong `ca.cer` is never spliced in. A chain that is already complete (multiple certificates) is used as-is; a **self-signed** certificate has no issuer to append and is also used as-is; if all three levels fail, the original PEM is kept and marked `incomplete` rather than preventing the panel from starting. Results are cached briefly so subscription and status requests do not repeatedly re-read the disk or re-download an AIA issuer.

Completion applies in three places: the panel HTTPS TLS config, ACME issuers loading a certificate from disk, and certificates batch-applied to Listeners.

### Inspecting chain state

`GET /api/v1/system/ssl/status` (admin JWT) returns `chain_status`:

| Field | Meaning |
|-------|---------|
| `checked` | Whether the chain was inspected |
| `complete` / `incomplete` | Chain is complete / still missing an intermediate |
| `self_signed` | Self-signed certificate (no completion needed) |
| `certificates` | Number of certificates actually loaded |
| `source` | Completion source, also returned separately as `chain_source` |

The state reflects the chain **this process actually loaded**, not a static re-read of the file — a leaf-only file on disk can still be completed in memory. The API returns machine-readable fields only; the frontend UI does not display them yet, so they are intended for troubleshooting and automation.

### Relationship to `skip-cert-verify`

Once a formal (non-self-signed) certificate has a complete chain, subscriptions and share links do **not** need `skip-cert-verify`. It is still set for: self-signed certificates, no certificate with an IP endpoint, Reality camouflage certificates, and an explicit user override (which always takes precedence).

## Rescue after a bad SSL config

```bash
3m-ui reset-config --panel --yes
systemctl restart 3m-ui
```

Or use the equivalent option in the SSH `3m-ui` menu. The panel comes back on plain HTTP so you can fix settings in the UI.

## Node certificates

Self-signed, uploaded path/PEM, or batch-apply to multiple Listeners; panel manual cert paths can also be reused (`from_panel_ssl`). See [Batch apply node certificates](./batch-certificate) — batch apply completes the chain too.

## Operations

- Store cert material under the panel data directory and include it in backups.
- Changing the domain or `web_path` may require re-issue and reverse-proxy updates.
