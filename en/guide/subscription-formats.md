---
title: Subscription formats & target
---

# Subscription formats & target

Client subscription URL (token path under `/api/v1/client/sub/...`):

| `target` | Body |
|----------|------|
| _(empty)_ / auto | UA-based: Clash YAML or v2ray Base64 |
| `clash` / `mihomo` | Mihomo/Clash Meta YAML (`proxies` + optional groups) |
| `v2ray` | Newline-joined share URIs, Base64 |
| `singbox` | Minimal sing-box outbounds JSON |

## Notes

- TLS identity (SNI / skip-cert) is resolved once via the panel export profile for URI and YAML paths.
- Bind users to listeners; unbound users get an empty or error subscription.
- External links and remote cluster mirrors can be merged into the same document when configured on the user.
