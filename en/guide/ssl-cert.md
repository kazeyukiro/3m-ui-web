---
title: SSL certificates
description: 3m-ui · panel and node certificates
---

# SSL certificates

## Panel HTTPS

Configure under **Settings → Certificates / SSL**, then **restart the panel**.

| Mode | Use when | Notes |
|------|----------|--------|
| **HTTP-01** (default) | Single hostname, public **port 80** | Standard Let's Encrypt |
| **DNS-01** | **Wildcard** `*.example.com`, or no port 80 | **Cloudflare** API token |
| **IP certificate** | Domain field is a public IP | Short-lived; HTTP-01 / TLS-ALPN-01 |
| **Manual** | `cert_file` + `key_file` paths | e.g. `/etc/letsencrypt/live/...` |

### Wildcard `*.example.com`

1. Set domain to `*.example.com` (or a hostname with challenge **DNS-01**)
2. ACME challenge: **DNS-01**
3. Provider: Cloudflare; token needs **Zone → DNS → Edit**
4. Optional zone name `example.com` if auto-detect fails
5. Save and restart; the cert includes `*.example.com` and apex `example.com`

Leave the token blank on later saves to keep the stored secret. `GET` never returns the token.

Details: [panel-ssl.md](https://github.com/kazeyukiro/3m-ui/blob/main/docs/panel-ssl.md)

### Recovery without reinstall

```bash
3m-ui reset-config --panel --yes
systemctl restart 3m-ui
```

## Node certificates

Self-signed, uploaded PEM/paths, or batch apply to listeners. Optional `from_panel_ssl` when the panel uses manual file paths.

See: [batch-certificate.md](https://github.com/kazeyukiro/3m-ui/blob/main/docs/batch-certificate.md)
